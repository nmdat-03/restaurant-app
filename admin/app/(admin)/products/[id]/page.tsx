import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import ProductForm from "@/components/product/ProductForm";
import Link from "next/link";
import CustomButton from "@/components/common/CustomButton";
import { ChevronLeft } from "lucide-react";

export default async function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
        redirect("/");
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            images: {
                orderBy: {
                    position: "asc",
                },
            },
        },
    });

    if (!product) {
        notFound();
    }

    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <div className="w-full p-3 space-y-5">
            {/* Back */}
            <div>
                <Link href="/products">
                    <CustomButton className="flex items-center bg-white shadow-md rounded-full px-3 py-2 text-sm">
                        <ChevronLeft size={14} />
                        Back to products
                    </CustomButton>
                </Link>
            </div>

            <ProductForm
                categories={categories}
                product={product}
                isEdit
            />
        </div>
    );
}