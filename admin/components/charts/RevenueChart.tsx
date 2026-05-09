"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

import {
    formatChartLabel,
    formatPrice,
    formatShortPrice,
} from "@/lib/format";
import { GroupBy } from "@/lib/reports/types";

type Props = {
    data: {
        date: string;
        revenue: number;
    }[];
    title?: string;
    showGrid?: boolean;
    groupBy?: GroupBy;
};

export default function RevenueChart({
    data,
    title = "Revenue",
    showGrid = true,
    groupBy = "day",
}: Props) {
    return (
        <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">
                {title}
            </h2>

            <ResponsiveContainer
                width="100%"
                height={400}
            >
                <LineChart data={data}>
                    {showGrid && (<CartesianGrid strokeDasharray="3 3" />)}

                    <XAxis
                        dataKey="date"
                        tickFormatter={(value) => formatChartLabel(value, groupBy)}
                    />

                    <YAxis tickFormatter={(value) => formatShortPrice(value)} />

                    <Tooltip
                        labelFormatter={(label) => formatChartLabel(label, groupBy)}
                        formatter={(value) =>
                            typeof value === "number"
                                ? formatPrice(value)
                                : ""
                        }
                    />

                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}