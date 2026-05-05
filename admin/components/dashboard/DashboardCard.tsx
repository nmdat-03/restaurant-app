"use client"

import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
    title: string;
    value: number;
    isMoney?: boolean;
    color?: string;
    href?: string;
};

export default function DashboardCard({ title, value, isMoney, color = "green", href }: Props) {
    const content = (
        <motion.div
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative overflow-hidden rounded-md border p-4 shadow-sm bg-white">
            <div
                className={`absolute left-0 top-0 w-full h-1 bg-linear-to-r ${color}`}
            />
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-semibold mt-2">
                {isMoney ? formatPrice(value) : value}
            </p>
        </motion.div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return content;
}