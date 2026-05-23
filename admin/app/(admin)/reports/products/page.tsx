import TopProducts from "@/components/dashboard/TopProducts";
import TopProductsChart from "@/components/reports/products/TopProductsChart";
import ReportFilter from "@/components/reports/ReportFilter";
import StatCard from "@/components/reports/StatCard";
import { getAllTimeTopProducts, getCategoryStats, getProductsReportData, getProductStats, getTopSellingProducts, getTotalProductsCount, groupProductSales } from "@/lib/reports/products";
import { GroupBy } from "@/lib/reports/types"
import { Banknote, Boxes, PackageCheck, PackageX } from "lucide-react";

export default async function ProductsReportPage({
    searchParams
}: {
    searchParams: Promise<{
        from?: string,
        to?: string,
        groupBy: GroupBy,
    }>
}) {
    const params = await searchParams;

    const groupBy: GroupBy = params.groupBy || "day";

    let from = params.from
        ? new Date(params.from)
        : undefined

    let to = params.to
        ? new Date(params.to)
        : undefined

    /* ===== Default ranges ===== */
    if (!from && !to) {
        const now = new Date();

        // Daily
        if (groupBy === "day") {
            to = new Date();
            from = new Date();
            from.setDate(from.getDate() - 6);
        }

        // Monthly
        if (groupBy === "month") {
            from = new Date(now.getFullYear(), 0, 1);
            to = new Date(now.getFullYear(), 11, 31);
        }

        // Yearly
        if (groupBy === "year") {
            from = new Date(now.getFullYear() - 4, 0, 1);
            to = new Date(now.getFullYear(), 11, 31);
        }
    }

    /* ===== Normalize time ===== */
    if (from) {
        from.setHours(0, 0, 0, 0)
    }

    if (to) {
        to.setHours(23, 59, 59, 999)
    }

    // ===== Fetch raw order items =====
    const items = await getProductsReportData(from, to);

    // ===== Aggregate products =====
    const products = groupProductSales(items);

    // ===== Get all products =====
    const totalProducts = await getTotalProductsCount();

    // ===== Stats =====
    const stats = getProductStats(products);

    // ===== Charts =====
    const topSellingProducts = getTopSellingProducts(products);

    //const categoryChartData = getCategoryStats(products);

    const allTimeTopProducts = await getAllTimeTopProducts();

    // ===== Cards =====
    const cards = [
        {
            title: "Total Products",
            value: totalProducts,
            icon: Boxes,
            gradient: "from-blue-400 to-blue-600",
        },
        {
            title: "Units Sold",
            value: stats.totalSold,
            icon: PackageCheck,
            gradient: "from-pink-400 to-pink-600",
        },
        {
            title: "Revenue",
            value: stats.totalRevenue,
            icon: Banknote,
            isMoney: true,
            gradient: "from-green-400 to-green-600",
        },
        {
            title: "Inactive Products",
            value: stats.inactiveProducts,
            icon: PackageX,
            gradient: "from-red-400 to-red-600",
        },
    ];

    return (
        <div className="w-full p-3 space-y-5">
            <h1 className="text-2xl font-bold">
                Products Report
            </h1>

            <ReportFilter basePath="/reports/products" />

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {cards.map((stat) => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        isMoney={stat.isMoney}
                        gradient={stat.gradient}
                    />
                ))}
            </div>

            <div className="grid grid-cols-5 gap-3">
                {/* Chart */}
                <div className="col-span-3">
                    {topSellingProducts.length == 0 ? (
                        <div className="h-full min-h-80 bg-white p-4 rounded-md shadow-md flex flex-col">
                            <h2 className="text-lg font-semibold mb-4">
                                Top Selling Products
                            </h2>

                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                No product sales data
                            </div>
                        </div>
                    ) : (
                        <TopProductsChart data={topSellingProducts} />
                    )}
                </div>

                {/* All time widget */}
                <div className="col-span-2 h-full">
                    <TopProducts products={allTimeTopProducts} />
                </div>
            </div>
        </div>
    )
}