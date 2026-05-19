import prisma from "@/lib/prisma";
import AdminProductsClient from "./AdminProductsClient";
import CustomPagination from "@/components/common/CustomPagination";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Prisma } from "@prisma/client";
import FilterComponent from "@/components/common/FilterComponent";
import AdminSearchBar from "@/components/common/AdminSearchBar";
import Link from "next/link";
import { Plus } from "lucide-react";

const PAGE_SIZE = 10;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    categoryId?: string;
    status?: string;
  }>;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const params = await searchParams;
  const currentPage = Number(params.page || "1");
  const keyword = params.q?.trim() || "";

  const where: Prisma.ProductWhereInput = {};

  // SEARCH
  if (keyword) {
    where.OR = [
      { id: keyword },
      {
        name: {
          contains: keyword,
          mode: Prisma.QueryMode.insensitive,
        },
      },
    ];
  }

  // CATEGORY
  if (params.categoryId) {
    where.categoryId = params.categoryId;
  }

  // STATUS
  if (params.status) {
    where.isActive = params.status === "active";
  }

  const [products, totalProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
        category: true,
      },
    }),

    prisma.product.count({ where }),

    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  const soldData = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      productId: {
        in: products.map((p) => p.id),
      },
      order: {
        orderStatus: "COMPLETED",
      },
    },
    _sum: {
      quantity: true,
    },
  });

  const soldMap = new Map(
    soldData.map((item) => [item.productId, item._sum.quantity || 0])
  );

  const productsWithSold = products.map((p) => ({
    ...p,
    sold: soldMap.get(p.id) || 0,
  }));

  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);

  return (
    <div className="w-full p-3">
      <div className="bg-white p-4 rounded-md shadow-md space-y-3">
        {/* TOP BAR */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Products</h1>

          <div className="flex items-center gap-3">
            {/* SEARCH */}
            <AdminSearchBar
              basePath="/products"
              placeholder="Search products..."
            />

            {/* FILTER */}
            <FilterComponent
              fields={[
                {
                  key: "categoryId",
                  label: "Category",
                  options: categories.map((c) => ({
                    label: c.name,
                    value: c.id,
                  })),
                },
                {
                  key: "status",
                  label: "Status",
                  options: [
                    { label: "Active", value: "active" },
                    { label: "Hidden", value: "hidden" },
                  ],
                },
              ]}
            />

            <Link
              href="/products/create"
              className="w-9 h-9 bg-linear-to-t from-slate-900 via-slate-800 to-slate-700 text-white rounded-md flex items-center justify-center"
            >
              <Plus size={18} />
            </Link>
          </div>
        </div>

        {/* TABLE */}
        <Suspense
          key={`${currentPage}-${keyword}-${params.categoryId}-${params.status}`}
          fallback={<div>Loading...</div>}
        >
          <AdminProductsClient products={productsWithSold} />
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