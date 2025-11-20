// src/app/api/purchases/[id]/complete/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/src/lib/prisma";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const { transactionId, paymentProof } = body;

    // Find purchase
    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "Purchase not found" },
        { status: 404 }
      );
    }

    if (purchase.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    if (purchase.paymentStatus === "COMPLETED") {
      return NextResponse.json(
        { error: "Purchase already completed" },
        { status: 400 }
      );
    }

    // Update purchase status
    const updatedPurchase = await prisma.purchase.update({
      where: { id },
      data: {
        paymentStatus: "COMPLETED",
        transactionId,
        paymentProof,
        completedAt: new Date(),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Create UserProduct entries for each purchased item
    const userProductsData = purchase.items.map(item => ({
      userId: user.id,
      productId: item.productId,
      purchasedAt: new Date(),
    }));

    await prisma.userProduct.createMany({
      data: userProductsData,
      skipDuplicates: true,
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "PAYMENT_COMPLETED",
        details: {
          purchaseId: id,
          transactionId,
          totalAmount: purchase.totalAmount,
        },
      },
    });

    return NextResponse.json({
      success: true,
      purchase: updatedPurchase,
      message: "Payment completed successfully",
    });

  } catch (error) {
    console.error("Error completing payment:", error);
    return NextResponse.json(
      { error: "Failed to complete payment" },
      { status: 500 }
    );
  }
}