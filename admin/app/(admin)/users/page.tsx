import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminUsersClient from "./AdminUsersClient";
import CustomPagination from "@/components/common/CustomPagination";
import { Prisma, Role } from "@prisma/client";
import AdminSearchBar from "@/components/common/AdminSearchBar";
import FilterComponent from "@/components/common/FilterComponent";

const PAGE_SIZE = 10;

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<{
        page?: string;
        q?: string;
        role?: string;
    }>;
}) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
        redirect("/");
    }

    const params = await searchParams;
    const currentPage = Number(params.page || "1");
    const keyword = params.q?.trim() || "";

    const where: Prisma.UserWhereInput = {};

    // SEARCH
    if (keyword) {
        where.OR = [
            {
                username: {
                    contains: keyword,
                    mode: Prisma.QueryMode.insensitive,
                },
            },
            {
                phone: {
                    contains: keyword,
                    mode: Prisma.QueryMode.insensitive,
                },
            },
            {
                email: {
                    contains: keyword,
                    mode: Prisma.QueryMode.insensitive,
                },
            },
        ];
    }

    // FILTER ROLE
    if (params.role) {
        where.role = params.role as Role;
    }

    const [users, totalUsers] = await Promise.all([
        prisma.user.findMany({
            where,
            skip: (currentPage - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                _count: {
                    select: {
                        orders: true,
                    },
                },
            },
        }),
        prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalUsers / PAGE_SIZE);

    return (
        <div className="w-full px-3 py-6">
            <div className="bg-white p-4 rounded-md shadow-md space-y-3">

                {/* TOP BAR */}
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h1 className="text-2xl font-bold">Users</h1>

                    <div className="flex items-center gap-3">
                        {/* SEARCH */}
                        <AdminSearchBar
                            basePath="/users"
                            placeholder="Search users..."
                        />

                        {/* FILTER */}
                        <FilterComponent
                            fields={[
                                {
                                    key: "role",
                                    label: "Role",
                                    options: [
                                        { label: "Admin", value: "ADMIN" },
                                        { label: "User", value: "USER" },
                                    ],
                                },
                            ]}
                        />
                    </div>
                </div>

                {/* TABLE */}
                <Suspense
                    key={`${currentPage}-${keyword}-${params.role}`}
                    fallback={<div>Loading...</div>}
                >
                    <AdminUsersClient users={users} />
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