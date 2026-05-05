import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminOrdersClient from "./AdminOrdersClient";
import CustomPagination from "@/components/common/CustomPagination";
import { Prisma, OrderStatus } from "@prisma/client";
import AdminSearchBar from "@/components/common/AdminSearchBar";
import FilterComponent from "@/components/common/FilterComponent";

const PAGE_SIZE = 10;

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: Promise<{
        page?: string;
        q?: string;
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

    const where: Prisma.OrderWhereInput = {};

    // SEARCH
    if (keyword) {
        where.OR = [
            { id: keyword },
            {
                fullName: {
                    contains: keyword,
                    mode: Prisma.QueryMode.insensitive,
                },
            },
            { phone: { contains: keyword } },
        ];
    }

    // FILTER STATUS
    if (params.status) {
        where.orderStatus = params.status as OrderStatus;
    }

    const [orders, totalOrders] = await Promise.all([
        prisma.order.findMany({
            where,
            skip: (currentPage - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
            orderBy: { createdAt: "desc" },
            include: {
                user: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        }),
        prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(totalOrders / PAGE_SIZE);

    return (
        <div className="w-full px-3 py-6">
            <div className="bg-white p-4 rounded-md shadow-md space-y-3">
                {/* TOP BAR */}
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h1 className="text-2xl font-bold">Orders</h1>

                    <div className="flex items-center gap-3">
                        {/* SEARCH */}
                        <AdminSearchBar
                            basePath="/orders"
                            placeholder="Search orders..."
                        />

                        {/* FILTER */}
                        <FilterComponent
                            fields={[
                                {
                                    key: "status",
                                    label: "Status",
                                    options: [
                                        { label: "Pending", value: "PENDING" },
                                        { label: "Confirmed", value: "CONFIRMED" },
                                        { label: "Completed", value: "COMPLETED" },
                                        { label: "Cancelled", value: "CANCELLED" },
                                    ],
                                },
                            ]}
                        />
                    </div>
                </div>

                {/* TABLE */}
                <Suspense
                    key={`${currentPage}-${keyword}-${params.status}`}
                    fallback={<div>Loading...</div>}
                >
                    <AdminOrdersClient orders={orders} />
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