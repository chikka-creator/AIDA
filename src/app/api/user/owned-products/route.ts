// src/app/api/user/owned-products/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/src/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
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

    // Get all products the user owns
    const ownedProducts = await prisma.userProduct.findMany({
      where: { userId: user.id },
      include: {
        product: true,
      },
      orderBy: {
        purchasedAt: 'desc',
      },
    });

    return NextResponse.json(ownedProducts);
  } catch (error) {
    console.error("Error fetching owned products:", error);
    return NextResponse.json(
      { error: "Failed to fetch owned products" },
      { status: 500 }
    );
  }
}