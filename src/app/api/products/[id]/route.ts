// src/app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/src/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT - Update product (Admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("Update request - Session:", session);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    console.log("Update request - User:", user);

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    
    console.log("Update request - ID:", id);
    console.log("Update request - Body:", body);

    // Validate required fields
    if (!body.title || !body.description || !body.price || !body.thumbnailUrl) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, price, and thumbnailUrl" },
        { status: 400 }
      );
    }

    // Parse price
    const parsedPrice = typeof body.price === 'string' ? parseInt(body.price) : body.price;
    if (isNaN(parsedPrice)) {
      return NextResponse.json(
        { error: "Price must be a valid number" },
        { status: 400 }
      );
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        title: body.title,
        subtitle: body.subtitle || null,
        description: body.description,
        price: parsedPrice,
        category: body.category || "LIGHTROOM_PRESET",
        status: body.status || "ACTIVE",
        thumbnailUrl: body.thumbnailUrl,
        imageUrls: body.imageUrls || [],
        fileUrl: body.fileUrl || null,
        fileSize: body.fileSize ? parseInt(body.fileSize) : null,
        tags: body.tags || [],
      },
    });

    console.log("Update request - Updated product:", product);

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete product (Admin only)
export async function DELETE(
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
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    
    // Check if product has been purchased
    const purchaseCount = await prisma.purchaseItem.count({
      where: { productId: id },
    });

    if (purchaseCount > 0) {
      // Product has been purchased - archive it instead of deleting
      await prisma.product.update({
        where: { id },
        data: { status: "ARCHIVED" },
      });

      return NextResponse.json({ 
        success: true, 
        message: "Product archived successfully (has purchase history)",
        archived: true 
      });
    } else {
      // Product has never been purchased - safe to delete
      await prisma.product.delete({
        where: { id },
      });

      return NextResponse.json({ 
        success: true, 
        message: "Product deleted successfully",
        archived: false 
      });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}