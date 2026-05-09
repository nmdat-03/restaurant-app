"use client";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
} from "recharts";

type Props = {
    data: {
        name: string;
        value: number;
    }[];
};

const COLORS = [
    "#F59E0B", // Pending
    "#3B82F6", // Confirmed
    "#8B5CF6", // Shipping
    "#10B981", // Completed
    "#EF4444", // Cancelled
];

export default function OrderStatusChart({
    data,
}: Props) {
    return (
        <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">
                Order Status
            </h2>

            <div className="w-full h-80">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <BarChart data={data} layout="vertical">
                        <XAxis type="number" />

                        <YAxis
                            type="category"
                            dataKey="name"
                            width={100}
                        />

                        <Tooltip />

                        <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                            {data.map((_, index) => (
                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}