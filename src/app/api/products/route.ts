// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/src/lib/prisma";

// GET all active products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - Create new product (Admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      subtitle,
      description,
      price,
      category,
      thumbnailUrl,
      imageUrls,
      fileUrl,
      fileSize,
      tags,
    } = body;

    // Validation
    if (!title || !description || !price || !thumbnailUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        title,
        subtitle,
        description,
        price: parseInt(price),
        category: category || "LIGHTROOM_PRESET",
        status: "ACTIVE",
        thumbnailUrl,
        imageUrls: imageUrls || [],
        fileUrl,
        fileSize: fileSize ? parseInt(fileSize) : null,
        tags: tags || [],
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}