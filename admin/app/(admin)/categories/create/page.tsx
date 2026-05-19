import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

import { redirect } from "next/navigation";
import Link from "next/link";

import { ChevronLeft } from "lucide-react";

import CustomButton from "@/components/common/CustomButton";
import CategoryForm from "@/components/category/CategoryForm";

export default async function CreateCategoryPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const categories = await prisma.category.findMany({
    where: {
      parentId: null,
    },

    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="w-full p-3 space-y-5">
      {/* BACK */}
      <div>
        <Link href="/categories">
          <CustomButton className="flex items-center bg-white shadow-md rounded-full px-3 py-2 text-sm">
            <ChevronLeft size={14} />
            Back to categories
          </CustomButton>
        </Link>
      </div>

      <CategoryForm categories={categories} />
    </div>
  );
}