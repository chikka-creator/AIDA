// src/app/api/purchases/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/src/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

// Create a new purchase
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    // Get user from database
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
    const { items, paymentMethod, username, whatsapp } = body;

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

    // Calculate total amount
    let totalAmount = 0;
    const productIds = items.map((item: any) => item.productId);
    
    // Fetch products to verify prices
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

    // Calculate total and prepare purchase items
    const purchaseItemsData = items.map((item: any) => {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      totalAmount += product.price * item.quantity;
      return {
        productId: product.id,
        priceAtPurchase: product.price,
      };
    });

    // Create purchase with items
    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        totalAmount,
        paymentMethod: paymentMethod || "E_WALLET",
        paymentStatus: "PENDING",
        ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
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

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "PURCHASE_CREATED",
        details: {
          purchaseId: purchase.id,
          totalAmount,
          itemCount: items.length,
          username,
          whatsapp,
        },
        ipAddress: purchase.ipAddress,
        userAgent: purchase.userAgent,
      },
    });

    return NextResponse.json({
      success: true,
      purchase,
      message: "Purchase created successfully",
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating purchase:", error);
    return NextResponse.json(
      { error: "Failed to create purchase", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Get user's purchases
export async function GET(request: Request) {
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

    const purchases = await prisma.purchase.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(purchases);

  } catch (error) {
    console.error("Error fetching purchases:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}