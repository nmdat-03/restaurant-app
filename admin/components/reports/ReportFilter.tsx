"use client";

import { GroupBy } from "@/lib/reports/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type Props = { basePath: string; };

function formatDate(date: Date) {
    return date.toISOString().split("T")[0];
}

export default function ReportFilter({
    basePath,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const [groupBy, setGroupBy] =
        useState<GroupBy>("day");

    useEffect(() => {
        setFrom(searchParams.get("from") || "");

        setTo(searchParams.get("to") || "");

        setGroupBy(
            (searchParams.get("groupBy") as GroupBy) || "day"
        );
    }, [searchParams]);

    const applyFilter = (
        f?: string,
        t?: string,
        g?: GroupBy
    ) => {
        const params = new URLSearchParams();

        if (f) { params.set("from", f) }

        if (t) { params.set("to", t) }

        if (g) { params.set("groupBy", g) }

        router.push(`${basePath}?${params.toString()}`);
    };

    const handleApply = () => {
        applyFilter(from, to, groupBy);
    };

    const resetFilter = () => {
        router.push(basePath);
    };

    // ===== Quick filters =====
    const quickFilter = (days: number) => {
        const toDate = new Date();

        const fromDate = new Date();

        fromDate.setDate(
            toDate.getDate() - days + 1
        );

        applyFilter(
            formatDate(fromDate),
            formatDate(toDate),
            groupBy
        );
    };

    const thisMonth = () => {
        const now = new Date();

        const fromDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        applyFilter(
            formatDate(fromDate),
            formatDate(now),
            groupBy
        );
    };

    return (
        <div className="bg-white p-4 rounded-md shadow space-y-3">
            {/* Manual filter */}
            <div className="flex items-end gap-3 flex-wrap">
                <div className="flex gap-2 items-center">
                    <label className="text-md text-gray-500">
                        From
                    </label>

                    <input
                        type="date"
                        value={from}
                        onChange={(e) =>
                            setFrom(e.target.value)
                        }
                        className="border rounded px-2 py-1"
                    />
                </div>

                <div className="flex gap-2 items-center">
                    <label className="text-md text-gray-500">
                        To
                    </label>

                    <input
                        type="date"
                        value={to}
                        onChange={(e) =>
                            setTo(e.target.value)
                        }
                        className="border rounded px-2 py-1"
                    />
                </div>

                {/* Group by */}
                <div className="flex gap-2 items-center">
                    <label className="text-md text-gray-500">
                        Group By
                    </label>

                    <select
                        value={groupBy}
                        onChange={(e) =>
                            setGroupBy(
                                e.target
                                    .value as GroupBy
                            )
                        }
                        className="border rounded px-2 py-1"
                    >
                        <option value="day">
                            Daily
                        </option>

                        <option value="month">
                            Monthly
                        </option>

                        <option value="year">
                            Yearly
                        </option>
                    </select>
                </div>

                <button
                    onClick={handleApply}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                    Apply
                </button>

                <button
                    onClick={resetFilter}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                >
                    Reset
                </button>
            </div>

            {/* Quick filters */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => quickFilter(7)}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                >
                    Last 7 days
                </button>

                <button
                    onClick={() => quickFilter(30)}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                >
                    Last 30 days
                </button>

                <button
                    onClick={thisMonth}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                >
                    This month
                </button>
            </div>
        </div>
    );
}