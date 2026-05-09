import OrdersReportChart from "@/components/reports/orders/OrdersReportChart";
import OrderStatusChart from "@/components/reports/orders/OrderStatusChart";
import PaymentMethodChart from "@/components/reports/orders/PaymentMethodChart";
import ReportFilter from "@/components/reports/ReportFilter"
import StatCard from "@/components/reports/StatCard";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatGroupLabel } from "@/lib/reports/helpers";
import { getCompletionRate, getOrdersData, getOrderStatusStats, getPaymentMethodStats, groupOrders } from "@/lib/reports/orders";
import { GroupBy } from "@/lib/reports/types"

export default async function OrdersReportPage({
    searchParams
}: {
    searchParams: Promise<{
        from?: string,
        to?: string,
        groupBy?: GroupBy
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

    const orders = await getOrdersData(from, to);

    /* ===== Chart data ===== */
    const chartData = groupOrders(orders, groupBy, from, to);

    /* ===== Table data ===== */
    const tableData = chartData.filter((item) => item.total > 0);


    const stats = getOrderStatusStats(orders);

    const completionRate = getCompletionRate(
        stats.completed,
        stats.total
    )

    const paymentStats = getPaymentMethodStats(orders);

    const paymentChartData = [
        {
            name: "COD",
            value: paymentStats.cod,
        },
        {
            name: "VNPay",
            value: paymentStats.vnpay,
        },
    ];

    const orderStatusChartData = [
        {
            name: "Pending",
            value: stats.pending,
        },
        {
            name: "Confirmed",
            value: stats.confirmed,
        },
        {
            name: "Shipping",
            value: stats.shipping,
        },
        {
            name: "Completed",
            value: stats.completed,
        },
        {
            name: "Cancelled",
            value: stats.cancelled,
        },
    ];

    const cards = [
        {
            title: "Total Orders",
            value: stats.total,
            gradient: "from-blue-400 to-blue-600",
        },
        {
            title: "Completed Orders",
            value: stats.completed,
            gradient: "from-green-400 to-green-600",
        },
        {
            title: "Cancelled Orders",
            value: stats.cancelled,
            gradient: "from-red-400 to-red-600",
        },
        {
            title: "Completion Rate",
            value: `${completionRate}%`,
            gradient: "from-purple-400 to-purple-600",
        },
    ];

    return (
        <div className="w-full px-3 py-6 space-y-6">
            <h1 className="text-2xl font-bold">
                Orders Report
            </h1>

            <ReportFilter basePath="/reports/orders" />

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {cards.map((stat) => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        gradient={stat.gradient}
                    />
                ))}
            </div>

            <div className="flex gap-3">
                <div className="w-1/3">
                    <PaymentMethodChart data={paymentChartData} />
                </div>
                <div className="w-2/3">
                    <OrderStatusChart data={orderStatusChartData} />
                </div>
            </div>

            {/* Chart */}
            {chartData.length === 0 ? (
                <div className="bg-white p-6 rounded-md shadow text-center text-gray-500">
                    No orders data
                </div>
            ) : (
                <OrdersReportChart
                    data={chartData}
                    title="Orders Overview"
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

                                <TableHead>Total Orders</TableHead>
                                <TableHead>Completed</TableHead>
                                <TableHead>Cancelled</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {tableData.map((item) => (
                                <TableRow key={item.date}>
                                    <TableCell>
                                        {formatGroupLabel(item.date, groupBy)}
                                    </TableCell>

                                    <TableCell>{item.total}</TableCell>
                                    <TableCell>{item.completed}</TableCell>
                                    <TableCell>{item.cancelled}</TableCell>
                                </TableRow>
                            )
                            )}

                            {tableData.length === 0 && (
                                <TableRow>
                                    <TableCell className="py-10 text-center text-gray-500">
                                        No orders found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}