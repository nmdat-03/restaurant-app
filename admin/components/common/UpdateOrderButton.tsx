"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

export default function UpdateOrderButton({
    id,
    status,
    label,
    variant = "confirm",
    className,
    onSuccess,
    onRequireConfirm,
}: {
    id: string;
    status: string;
    label?: string;
    variant?: "confirm" | "ship" | "complete" | "cancel";
    className?: string;
    onSuccess?: () => void;
    onRequireConfirm?: (id: string, status: string) => void;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const needConfirm =
        status === "CANCELLED" ||
        status === "COMPLETED";

    const handleClick = () => {
        if (needConfirm && onRequireConfirm) {
            onRequireConfirm(id, status);
            return;
        }

        startTransition(async () => {
            await fetch(`/api/orders/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderStatus: status,
                }),
            });

            onSuccess?.();
            router.refresh();
        });
    };

    const variants = {
        confirm:
            "text-blue-600 bg-blue-100 border border-blue-600",
        ship:
            "text-purple-600 bg-purple-100 border border-purple-600",
        cancel:
            "text-red-600 bg-red-100 border border-red-600",
        complete:
            "text-green-600 bg-green-100 border border-green-600",
    };

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className={cn(
                "rounded-md px-2 py-1 text-left text-sm transition disabled:opacity-50",
                variants[variant],
                className
            )}
        >
            {isPending
                ? "Processing..."
                : label || status}
        </button>
    );
}