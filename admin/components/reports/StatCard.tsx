import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

type Props = {
    title: string;
    value: string | number;
    isMoney?: boolean;
    gradient?: string;
    href?: string;
    icon?: LucideIcon;
};

export default function StatCard({
    title,
    value,
    isMoney,
    gradient = "from-green-400 to-green-600",
    href,
    icon: Icon,
}: Props) {

    const displayValue = isMoney && typeof value === "number"
        ? formatPrice(value)
        : value;

    const valueClass = isMoney
        ? "mt-2 text-xl font-semibold"
        : "mt-2 text-xl font-semibold text-center";

    const content = (
        <div className="relative overflow-hidden rounded-md border bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className={`absolute left-0 top-0 h-1 w-full bg-linear-to-r ${gradient}`} />

            <div className="flex items-center gap-2 text-gray-500">
                {Icon && <Icon size={18} />}
                <p className="text-sm">{title}</p>
            </div>

            <p className={valueClass}>
                {displayValue}
            </p>
        </div>
    );

    if (href) {
        return (
            <Link href={href}>
                {content}
            </Link>
        );
    }

    return content;
}