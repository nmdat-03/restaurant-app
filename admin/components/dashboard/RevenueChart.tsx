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
import { formatPrice, formatShortPrice } from "@/lib/format";

type Props = {
    data: {
        date: string;
        revenue: number;
    }[];
};

export default function RevenueChart({ data }: Props) {
    return (
        <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">
                Revenue (7 days)
            </h2>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(value) => {
                            const d = new Date(value);
                            return d.toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                            });
                        }}
                    />
                    <YAxis tickFormatter={(value) => formatShortPrice(value)} />

                    <Tooltip
                        labelFormatter={(label) => {
                            const d = new Date(label);
                            return d.toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            });
                        }}
                        formatter={(value) =>
                            typeof value === "number" ? formatShortPrice(value) : ""
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