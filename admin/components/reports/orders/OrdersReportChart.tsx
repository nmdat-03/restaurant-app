"use client";

import { formatChartLabel } from "@/lib/format";
import { GroupBy } from "@/lib/reports/types";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

type Props = {
    data: {
        date: string;
        total: number;
        completed: number;
        cancelled: number;
    }[];
    title: string;
    groupBy: GroupBy;
};

export default function OrdersReportChart({
    data,
    title,
    groupBy,
}: Props) {
    return (
        <div className="rounded-md bg-white p-4 shadow-md">
            <h2 className="mb-4 text-lg font-semibold">
                {title}
            </h2>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="date"
                        tickFormatter={(value) => formatChartLabel(value, groupBy)}
                    />

                    <YAxis allowDecimals={false} />

                    <Tooltip
                        labelFormatter={(label) => formatChartLabel(label, groupBy)}
                    />

                    <Bar dataKey="total" fill="#3b82f6" />
                    <Bar dataKey="completed" fill="#10b981" />
                    <Bar dataKey="cancelled" fill="#ef4444" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}