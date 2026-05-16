import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

import AdminCategoriesClient from "./AdminCategoriesClient";

import CustomPagination from "@/components/common/CustomPagination";
import AdminSearchBar from "@/components/common/AdminSearchBar";
import FilterComponent from "@/components/common/FilterComponent";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Suspense } from "react";

const PAGE_SIZE = 10;

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
    parentId?: string;
  }>;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const params = await searchParams;

  const currentPage = Number(params.page || "1");
  const keyword = params.q?.trim() || "";

  const where: Prisma.CategoryWhereInput = {};

  // ===== SEARCH =====
  if (keyword) {
    where.OR = [
      {
        name: {
          contains: keyword,
          mode: Prisma.QueryMode.insensitive,
        },
      },
      {
        slug: {
          contains: keyword,
          mode: Prisma.QueryMode.insensitive,
        },
      },
    ];
  }

  // ===== STATUS =====
  if (params.status) {
    where.isActive = params.status === "active";
  }

  // ===== PARENT CATEGORY =====
  if (params.parentId === "root") {
    where.parentId = null;
  } else if (params.parentId) {
    where.parentId = params.parentId;
  }

  const [categories, totalCategories, parentCategories] = await Promise.all([
    prisma.category.findMany({
      where,

      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        parent: true,

        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    }),

    prisma.category.count({
      where,
    }),

    prisma.category.findMany({
      where: {
        parentId: null,
      },

      orderBy: {
        name: "asc",
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCategories / PAGE_SIZE);

  return (
    <div className="w-full px-3 py-6">
      <div className="bg-white p-4 rounded-md shadow-md space-y-3">
        {/* TOP BAR */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Categories</h1>

          <div className="flex items-center gap-3">
            {/* SEARCH */}
            <AdminSearchBar
              basePath="/categories"
              placeholder="Search categories..."
            />

            {/* FILTER */}
            <FilterComponent
              fields={[
                {
                  key: "status",
                  label: "Status",
                  options: [
                    {
                      label: "Active",
                      value: "active",
                    },
                    {
                      label: "Hidden",
                      value: "hidden",
                    },
                  ],
                },

                {
                  key: "parentId",
                  label: "Type",
                  options: [
                    {
                      label: "Root Categories",
                      value: "root",
                    },

                    ...parentCategories.map((category) => ({
                      label: category.name,
                      value: category.id,
                    })),
                  ],
                },
              ]}
            />

            {/* CREATE */}
            <Link
              href="/categories/create"
              className="w-9 h-9 bg-black text-white rounded-md flex items-center justify-center"
            >
              <Plus size={18} />
            </Link>
          </div>
        </div>

        {/* TABLE */}
        <Suspense
          key={`${currentPage}-${keyword}-${params.status}-${params.parentId}`}
          fallback={<div>Loading...</div>}
        >
          <AdminCategoriesClient categories={categories} />
        </Suspense>

        {/* PAGINATION */}
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}