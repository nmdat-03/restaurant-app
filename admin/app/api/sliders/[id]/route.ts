import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sliderUpdateSchema } from "@/lib/validators/slider";
import { deleteImage } from "@/lib/cloudinary";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = sliderUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid data",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { id } = await params;
    const data = parsed.data;

    const existing = await prisma.slider.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Slider not found" },
        { status: 404 },
      );
    }

    if (data.image && existing.publicId) {
      await deleteImage(existing.publicId);
    }

    const slider = await prisma.slider.update({
      where: { id },
      data: {
        ...(data.image && {
          image: data.image.url,
          publicId: data.image.publicId || null,
        }),
        ...(data.link !== undefined && { link: data.link }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return NextResponse.json(slider);
  } catch (error: any) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const slider = await prisma.slider.findUnique({
      where: { id },
    });

    if (!slider) {
      return NextResponse.json(
        { message: "Slider not found" },
        { status: 404 },
      );
    }

    if (slider.publicId) {
      try {
        await deleteImage(slider.publicId);
      } catch (err) {
        console.error("Cloudinary delete failed:", err);
      }
    }

    await prisma.slider.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Slider deleted",
    });
  } catch (error: any) {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
