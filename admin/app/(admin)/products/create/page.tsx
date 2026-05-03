import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProductForm from "@/components/product/ProductForm";
import Link from "next/link";
import CustomButton from "@/components/common/CustomButton";
import { ChevronLeft } from "lucide-react";

export default async function CreateProductPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
        redirect("/");
    }

    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <div className="w-full px-6 py-6 space-y-5">
            {/* Back */}
            <div>
                <Link href="/products">
                    <CustomButton className="flex items-center bg-white shadow-md rounded-full px-3 py-2 text-sm">
                        <ChevronLeft size={14} />
                        Back to products
                    </CustomButton>
                </Link>
            </div>

            <ProductForm categories={categories} />
        </div>
    );
}