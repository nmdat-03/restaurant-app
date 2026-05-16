import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

import { getCurrentUser } from "@/lib/auth";

import { categorySchema } from "@/lib/validators/category";

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

    const parsed = categorySchema.safeParse(body);

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

    // prevent self parent
    if (data.parentId === id) {
      return NextResponse.json(
        {
          message: "Category cannot be its own parent",
        },
        { status: 400 },
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: body.slug,
        image: data.image || null,
        parentId: data.parentId || null,
      },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          message: "Slug already exists",
        },
        { status: 400 },
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          message: "Category not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Update failed",
      },
      { status: 500 },
    );
  }
}
