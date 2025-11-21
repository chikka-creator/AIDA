// src/app/api/upload/image/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    console.log("Upload route called");
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.log("Unauthorized - no session");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("User authenticated:", session.user.email);

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.log("No file provided");
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    console.log("File received:", file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log("Invalid file type:", file.type);
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log("File too large:", file.size);
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop();
    const fileName = `product-${timestamp}-${randomString}.${fileExt}`;

    console.log("Generated filename:", fileName);

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("Buffer created, size:", buffer.length);

    // Upload to Supabase Storage
    console.log("Uploading to Supabase...");
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json(
        { error: "Failed to upload image", details: error.message },
        { status: 500 }
      );
    }

    console.log("Upload successful:", data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    console.log("Public URL:", publicUrl);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: "Failed to upload image", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Optional: DELETE endpoint to remove old images
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { fileName } = await request.json();

    if (!fileName) {
      return NextResponse.json(
        { error: "No fileName provided" },
        { status: 400 }
      );
    }

    const { error } = await supabase.storage
      .from('product-images')
      .remove([fileName]);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json(
        { error: "Failed to delete image" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}