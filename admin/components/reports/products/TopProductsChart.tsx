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
        sold: number;
    }[];
};

const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
];

export default function TopProductsChart({
    data,
}: Props) {
    return (
        <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">
                Top Selling Products
            </h2>

            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical">
                        <XAxis type="number" />

                        <YAxis
                            type="category"
                            dataKey="name"
                            width={140}
                        />

                        <Tooltip />

                        <Bar dataKey="sold" radius={[0, 6, 6, 0]}>
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