import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CustomButton from "@/components/common/CustomButton";
import CategoryForm from "@/components/category/CategoryForm";

export default async function EditCategoryPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
        redirect("/");
    }

    const { id } = await params;

    const category =
        await prisma.category.findUnique({
            where: { id },
        });

    if (!category) {
        notFound();
    }

    const categories =
        await prisma.category.findMany({
            where: {
                NOT: { id },
                parentId: null,
            },
            orderBy: { name: "asc" },
        });

    return (
        <div className="w-full px-6 py-6 space-y-5">
            {/* BACK */}
            <div>
                <Link href="/categories">
                    <CustomButton className="flex items-center bg-white shadow-md rounded-full px-3 py-2 text-sm">
                        <ChevronLeft size={14} />
                        Back to categories
                    </CustomButton>
                </Link>
            </div>

            <CategoryForm
                categories={categories}
                category={category}
                isEdit
            />
        </div>
    );
}