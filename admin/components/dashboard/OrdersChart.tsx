"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts";

type Props = {
    data: {
        date: string;
        total: number;
        completed: number;
        cancelled: number;
    }[];
};

export default function OrdersChart({ data }: Props) {
    return (
        <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">
                Orders Overview (Last 7 days)
            </h2>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
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

                    <YAxis allowDecimals={false} />

                    <Tooltip
                        labelFormatter={(label) => {
                            const d = new Date(label);
                            return d.toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            });
                        }}
                    />

                    <Legend />

                    <Bar dataKey="total" name="Total" fill="#3b82f6" />
                    <Bar dataKey="completed" name="Completed" fill="#10b981" />
                    <Bar dataKey="cancelled" name="Cancelled" fill="#ef4444" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}