import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

import { categorySchema } from "@/lib/validators/category";

export async function POST(req: NextRequest) {
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

    const data = parsed.data;

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: body.slug,
        image: data.image || null,
        parentId: data.parentId || null,
        isActive: true,
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

    return NextResponse.json(
      {
        message: "Create failed",
      },
      { status: 500 },
    );
  }
}
