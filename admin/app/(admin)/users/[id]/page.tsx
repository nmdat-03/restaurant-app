import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import CustomButton from "@/components/common/CustomButton";
import { Banknote, ChevronLeft, Package, PackageX } from "lucide-react";
import { formatOrderTime, formatPrice } from "@/lib/format";
import { OrderStatusBadge, RoleBadge } from "@/components/common/Badges";

export default async function AdminUserDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
        redirect("/");
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            orders: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 10,
            },
            _count: {
                select: {
                    orders: true,
                },
            },
        },
    });

    if (!user) return notFound();

    const paidOrders = await prisma.order.aggregate({
        where: {
            userId: user.id,
            paymentStatus: "PAID",
        },
        _sum: {
            total: true,
        },
    });

    const totalSpent = paidOrders._sum.total ?? 0;

    const cancelledOrders = await prisma.order.count({
        where: {
            userId: user.id,
            orderStatus: "CANCELLED",
        },
    });

    return (
        <div className="w-full px-6 py-6 space-y-5">
            {/* Back button */}
            <div>
                <Link href="/users">
                    <CustomButton className="flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm shadow-md">
                        <ChevronLeft size={14} />
                        Back to users
                    </CustomButton>
                </Link>
            </div>

            {/* User detail */}
            <div className="rounded-md bg-white p-6 shadow-md space-y-4">
                <h1 className="text-2xl font-bold">User Detail</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-3">
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium">{user.name || " - "}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Username</p>
                            <p className="font-medium">{user.username || " - "}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{user.phone || " - "}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{user.email || " - "}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Role</p>
                            <RoleBadge role={user.role} />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Created at</p>
                            <p className="font-medium">
                                {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Total Orders */}
                <div className="relative bg-white p-4 rounded-md shadow-md flex flex-col gap-2 items-center justify-center overflow-hidden">
                    <div className="absolute left-0 top-0 w-full h-1 bg-linear-to-b from-blue-300 to-blue-500" />
                    <div className="flex gap-2 items-center">
                        <Package size={20} />
                        <p className="text-lg">Total Orders</p>
                    </div>
                    <p className="text-xl font-medium">
                        {user._count.orders}
                    </p>
                </div>
                {/* Total Spent */}
                <div className="relative bg-white p-4 rounded-md shadow-md flex flex-col gap-2 items-center justify-center overflow-hidden">
                    <div className="absolute left-0 top-0 w-full h-1 bg-linear-to-b from-green-300 to-green-500" />
                    <div className="flex gap-2 items-center">
                        <Banknote size={20} />
                        <p className="text-lg">Total Spent</p>
                    </div>
                    <p className="text-xl font-medium">
                        {formatPrice(totalSpent)}
                    </p>
                </div>
                {/* Cancelled Orders */}
                <div className="relative bg-white p-4 rounded-md shadow-md flex flex-col gap-2 items-center justify-center overflow-hidden">
                    <div className="absolute left-0 top-0 w-full h-1 bg-linear-to-b from-red-300 to-red-500" />
                    <div className="flex gap-2 items-center">
                        <PackageX size={20} />
                        <p className="text-lg">Cancelled Orders</p>
                    </div>
                    <p className="text-xl font-medium">
                        {cancelledOrders}
                    </p>
                </div>
            </div>

            <div className="rounded-md bg-white p-6 shadow-md space-y-4">
                <h2 className="text-xl font-semibold">
                    Recent Orders
                </h2>

                {user.orders.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        No orders yet
                    </p>
                ) : (
                    <div className="space-y-3">
                        {user.orders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between rounded-md border p-3"
                            >
                                <div className="flex flex-col gap-2">
                                    <p>
                                        Order ID:{" "}
                                        <Link
                                            href={`/orders/${order.id}?from=/users/${user.id}`}
                                            className="font-medium hover:underline"
                                        >
                                            {order.id}
                                        </Link>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatOrderTime(order.createdAt)}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <OrderStatusBadge status={order.orderStatus} />
                                    <p className="flex justify-end font-semibold">
                                        {formatPrice(order.total)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}