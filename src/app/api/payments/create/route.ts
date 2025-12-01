// src/app/api/payments/create/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/src/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { items, paymentMethod, paymentType, username, whatsapp } = body;

    console.log('Payment create request:', { items, paymentMethod, paymentType, username, whatsapp });

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      );
    }

    if (!username || !whatsapp) {
      return NextResponse.json(
        { error: "Username and WhatsApp are required" },
        { status: 400 }
      );
    }

    // Calculate total
    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        status: "ACTIVE",
      },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: "Some products are not available" },
        { status: 400 }
      );
    }

    let totalAmount = 0;
    const purchaseItemsData = items.map((item: any) => {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      totalAmount += product.price * (item.quantity || 1);
      return {
        productId: product.id,
        priceAtPurchase: product.price,
      };
    });

    // **FIX: Use paymentType (the method type) instead of paymentProvider**
    const paymentMethodForDb = paymentType || "E_WALLET";

    // Create purchase
    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        totalAmount,
        paymentMethod: paymentMethodForDb, // Use E_WALLET, BANK_TRANSFER, etc.
        paymentStatus: "PENDING",
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
        items: {
          create: purchaseItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Create payment simulation based on type
    let paymentData;
    
    if (paymentType === 'QRIS') {
      paymentData = {
        type: 'QRIS',
        qrString: `QRIS-${purchase.id}-${Date.now()}`,
        expiryTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      };
    } else if (paymentType === 'BANK_TRANSFER') {
      const bankAccounts: Record<string, { accountNumber: string; accountName: string }> = {
        BCA: { accountNumber: '8880012345678', accountName: 'AIDA CREATIVE' },
        MANDIRI: { accountNumber: '1370012345678', accountName: 'AIDA CREATIVE' },
        BNI: { accountNumber: '0012345678', accountName: 'AIDA CREATIVE' },
        BRI: { accountNumber: '012345678901234', accountName: 'AIDA CREATIVE' },
      };
      
      const selectedBank = paymentMethod as string;
      const bankInfo = bankAccounts[selectedBank] || bankAccounts['BCA'];
      
      paymentData = {
        type: 'BANK_TRANSFER',
        bank: selectedBank,
        ...bankInfo,
        amount: totalAmount,
        expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };
    } else if (paymentType === 'E_WALLET') {
      paymentData = {
        type: 'E_WALLET',
        provider: paymentMethod,
        deeplink: `${paymentMethod.toLowerCase()}://pay?id=${purchase.id}&amount=${totalAmount}`,
        expiryTime: new Date(Date.now() + 15 * 60 * 1000),
      };
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "PAYMENT_INITIATED",
        details: {
          purchaseId: purchase.id,
          totalAmount,
          paymentMethod: paymentMethodForDb,
          paymentProvider: paymentMethod,
          username,
          whatsapp,
        },
      },
    });

    return NextResponse.json({
      success: true,
      purchase,
      paymentData,
      message: "Payment initiated successfully",
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Failed to create payment", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}