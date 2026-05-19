import RevenueChart from "@/components/charts/RevenueChart";
import ReportFilter from "@/components/reports/ReportFilter";
import { formatPrice } from "@/lib/format";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Banknote, HandCoins, PackageCheck } from "lucide-react";
import { getRevenueData, groupRevenue } from "@/lib/reports/revenue";
import StatCard from "@/components/reports/StatCard";
import { GroupBy } from "@/lib/reports/types";
import { formatGroupLabel } from "@/lib/reports/helpers";

/* ===== Page ===== */
export default async function RevenueReportPage({
    searchParams,
}: {
    searchParams: Promise<{
        from?: string;
        to?: string;
        groupBy?: GroupBy;
    }>;
}) {
    const params = await searchParams;

    const groupBy: GroupBy = params.groupBy || "day";

    let from = params.from
        ? new Date(params.from)
        : undefined;

    let to = params.to
        ? new Date(params.to)
        : undefined;

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
        from.setHours(0, 0, 0, 0);
    }

    if (to) {
        to.setHours(23, 59, 59, 999);
    }

    const orders = await getRevenueData(from, to);

    /* ===== Chart data ===== */
    const chartData = groupRevenue(orders, groupBy, from, to);

    /* ===== Table data ===== */
    const tableData = chartData.filter((item) => item.revenue > 0);

    /* ===== Stats ===== */
    const totalRevenue = orders.reduce(
        (sum, o) => sum + Number(o.total), 0
    );

    const averageOrderValue =
        orders.length > 0
            ? totalRevenue / orders.length
            : 0;

    const chartTitle = groupBy === "day"
        ? "Daily Revenue"
        : groupBy === "month"
            ? "Monthly Revenue"
            : "Yearly Revenue";

    const stats = [
        {
            title: "Total Revenue",
            value: totalRevenue,
            isMoney: true,
            icon: Banknote,
            gradient: "from-green-400 to-green-600",
        },

        {
            title: "Total Orders",
            value: orders.length,
            icon: PackageCheck,
            gradient: "from-blue-400 to-blue-600",
        },

        {
            title: "Average Order Value",
            value: averageOrderValue,
            isMoney: true,
            icon: HandCoins,
            gradient: "from-purple-400 to-purple-600",
        },
    ];

    return (
        <div className="w-full p-3 space-y-5">
            <h1 className="text-2xl font-bold">
                Revenue Report
            </h1>

            <ReportFilter basePath="/reports/revenue" />

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        isMoney={stat.isMoney}
                        icon={stat.icon}
                        gradient={stat.gradient}
                    />
                ))}
            </div>

            {/* Chart */}
            {chartData.length === 0 ? (
                <div className="bg-white p-6 rounded-md shadow text-center text-gray-500">
                    No revenue data
                </div>
            ) : (
                <RevenueChart
                    data={chartData}
                    title={chartTitle}
                    groupBy={groupBy}
                />
            )}

            {/* Table */}
            <div className="bg-white p-4 rounded-md shadow-md">
                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-200 hover:bg-gray-200">
                                <TableHead>
                                    {groupBy === "day"
                                        ? "Date"
                                        : groupBy === "month"
                                            ? "Month"
                                            : "Year"}
                                </TableHead>

                                <TableHead>Revenue</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {tableData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={2} className="py-10 text-center text-gray-500">
                                        No orders found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tableData.map((item) => (
                                    <TableRow key={item.date}>
                                        <TableCell>
                                            {formatGroupLabel(item.date, groupBy)}
                                        </TableCell>

                                        <TableCell>
                                            {formatPrice(Number(item.revenue) || 0)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}