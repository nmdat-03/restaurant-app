import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminSlidersClient from "./AdminSlidersClient";
import CustomPagination from "@/components/common/CustomPagination";
import { Prisma } from "@prisma/client";

const PAGE_SIZE = 10;

export default async function AdminSlidersPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; q?: string }>;
}) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
        redirect("/");
    }

    const params = await searchParams;

    const currentPage = Number(params.page || "1");
    const keyword = params.q?.trim() || "";

    const where: Prisma.SliderWhereInput = {};

    if (keyword) {
        where.OR = [
            {
                title: {
                    contains: keyword,
                    mode: "insensitive",
                },
            },
            {
                subtitle: {
                    contains: keyword,
                    mode: "insensitive",
                },
            },
            {
                link: {
                    contains: keyword,
                    mode: "insensitive",
                },
            },
        ];
    }

    const [sliders, totalSliders] = await Promise.all([
        prisma.slider.findMany({
            where,
            skip: (currentPage - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
            orderBy: [
                { sortOrder: "asc" },
                { createdAt: "desc" },
            ],
        }),

        prisma.slider.count({ where }),
    ]);

    const totalPages = Math.ceil(totalSliders / PAGE_SIZE);

    return (
        <div className="w-full px-6 py-6">
            <Suspense
                key={`${currentPage}-${keyword}`}
                fallback={<div>Loading...</div>}
            >
                <AdminSlidersClient sliders={sliders} />
            </Suspense>

            <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
            />
        </div>
    );
}