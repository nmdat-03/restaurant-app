import prisma from "@/lib/prisma";
import OrdersTable from "@/components/dashboard/OrdersTable";
import Link from "next/link";
import DashboardCard from "@/components/dashboard/DashboardCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { getOrderStatsLast7Days, getRevenueLast7Days, getTopProducts } from "@/lib/dashboard";
import OrdersChart from "@/components/dashboard/OrdersChart";
import TopProducts from "@/components/dashboard/TopProducts";

export default async function AdminDashboardPage() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
        totalUsers,
        totalProducts,
        totalOrders,
        revenueResult,
        pendingOrders,
        ordersToday,
        recentOrders,
        chartData,
        orderStatsData,
        topProducts,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.order.count(),

        prisma.order.aggregate({
            where: {
                orderStatus: "COMPLETED",
                paymentStatus: "PAID",
            },
            _sum: { total: true },
        }),

        prisma.order.count({
            where: { orderStatus: "PENDING" },
        }),

        prisma.order.count({
            where: {
                createdAt: {
                    gte: today,
                },
            },
        }),

        prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                user: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        }),

        getRevenueLast7Days(),
        getOrderStatsLast7Days(),
        getTopProducts(),
    ]);

    const totalRevenue = revenueResult._sum.total || 0;

    return (
        <div className="w-full px-3 py-6 space-y-3">
            <h1 className="text-2xl font-semibold">Dashboard</h1>

            {/* Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <DashboardCard
                    title="Total Users"
                    value={totalUsers}
                    color="from-blue-400 to-blue-500"
                    href="/users"
                />
                <DashboardCard
                    title="Total Products"
                    value={totalProducts}
                    color="from-orange-400 to-orange-500"
                    href="/products"
                />
                <DashboardCard
                    title="Total Orders"
                    value={totalOrders}
                    color="from-pink-400 to-pink-500"
                    href="/orders"
                />
                <DashboardCard
                    title="Total Revenue"
                    value={totalRevenue}
                    color="from-green-400 to-green-500"
                    isMoney
                />
                <DashboardCard
                    title="Pending Orders"
                    value={pendingOrders}
                    color="from-yellow-400 to-yellow-500"
                    href="/orders?status=PENDING"
                />
                <DashboardCard
                    title="Orders Today"
                    value={ordersToday}
                    color="from-purple-400 to-purple-500"
                />
            </div>

            {/* Recent Orders */}
            <div className="bg-white p-4 rounded-md shadow-md space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        Recent Orders
                    </h2>

                    <Link
                        href="/orders"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        View all
                    </Link>
                </div>

                <OrdersTable orders={recentOrders} />
            </div>

            <RevenueChart data={chartData} />

            <OrdersChart data={orderStatsData} />

            <TopProducts products={topProducts} />
        </div>
    );
}