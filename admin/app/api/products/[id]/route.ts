import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { productSchema } from "@/lib/validators/product";
import { deleteImage } from "@/lib/cloudinary";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid data",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { id } = await params;

    const data = parsed.data;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const removedImages = existingProduct.images.filter(
      (oldImg) =>
        !data.images.some(
          (newImg) => newImg.publicId === oldImg.publicId
        )
    );

    const product = await prisma.$transaction(async (tx) => {
      await tx.productImage.deleteMany({
        where: {
          productId: id,
        },
      });

      return tx.product.update({
        where: { id },

        data: {
          name: data.name,
          slug: body.slug,
          price: data.price,
          description: data.description || null,
          categoryId: data.categoryId,

          images: {
            create: data.images.map((img, index) => ({
              url: img.url,
              publicId: img.publicId || null,
              position: index,
              isPrimary: index === 0,
            })),
          },
        },

        include: {
          images: {
            orderBy: {
              position: "asc",
            },
          },
        },
      });
    });

    await Promise.all(
      removedImages
        .filter((img) => img.publicId)
        .map((img) => deleteImage(img.publicId!))
    );

    return NextResponse.json(product);
  } catch (error: any) {
    console.error(error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Slug already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    );
  }
}