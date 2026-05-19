"use client";

import { useMemo, useState } from "react";
import { Slider } from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import Link from "next/link";
import Image from "next/image";
import { MoreHorizontal, Plus } from "lucide-react";
import AdminSearchBar from "@/components/common/AdminSearchBar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useRouter } from "next/navigation";
import { SliderStatusBadge } from "@/components/common/Badges";

type ConfirmState = {
    id: string;
} | null;

const optimizeImage = (url: string, width = 300) => {
    if (!url.includes("/upload/")) return url;
    return url.replace(
        "/upload/",
        `/upload/w_${width},q_auto,f_auto/`
    );
};

export default function AdminSlidersClient({
    sliders,
}: {
    sliders: Slider[];
}) {
    const [sliderList, setSliderList] = useState(sliders);

    const sortedSliders = useMemo(
        () => sliderList,
        [sliderList]
    );

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [confirm, setConfirm] = useState<ConfirmState>(null);

    const handleToggle = async (slider: Slider) => {
        setSliderList((prev) =>
            prev.map((item) =>
                item.id === slider.id
                    ? { ...item, isActive: !item.isActive }
                    : item
            )
        );

        try {
            const res = await fetch(`/api/sliders/${slider.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    isActive: !slider.isActive,
                }),
            });

            if (!res.ok) throw new Error("Update failed");
        } catch {
            setSliderList((prev) =>
                prev.map((item) =>
                    item.id === slider.id
                        ? { ...item, isActive: slider.isActive }
                        : item
                )
            );
        }
    };

    const handleConfirmDelete = async () => {
        if (!confirm) return;

        const id = confirm.id;

        setSliderList((prev) =>
            prev.filter((item) => item.id !== id)
        );

        setConfirm(null);

        try {
            setLoading(true);

            const res = await fetch(`/api/sliders/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error();
        } catch {
            router.refresh();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-md p-4 shadow-md space-y-5">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">
                    Sliders
                </h1>

                <div className="flex gap-2 items-center">
                    <AdminSearchBar
                        basePath="/sliders"
                        placeholder="Search sliders..."
                    />

                    <Link
                        href="/sliders/create"
                        className="w-9 h-9 bg-linear-to-t from-slate-900 via-slate-800 to-slate-700 text-white rounded-md flex items-center justify-center"
                    >
                        <Plus size={18} />
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-200 hover:bg-gray-200">
                            <TableHead>Preview</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="bg-white">
                        {sortedSliders.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="py-10 text-center text-gray-500"
                                >
                                    No sliders found
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedSliders.map((slider) => {
                                const optimizedUrl = optimizeImage(slider.image, 300);

                                return (
                                    <TableRow key={slider.id}>
                                        <TableCell>
                                            <div className="relative w-36 h-20 rounded overflow-hidden">
                                                <Image
                                                    src={optimizedUrl}
                                                    alt={slider.altText || "banner"}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <SliderStatusBadge
                                                active={slider.isActive}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {slider.sortOrder}
                                        </TableCell>

                                        <TableCell>
                                            {new Date(
                                                slider.createdAt
                                            ).toLocaleDateString()}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-gray-100">
                                                        <MoreHorizontal size={16} />
                                                    </button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-44"
                                                >
                                                    <DropdownMenuItem className="px-4 py-2">
                                                        <Link href={`/sliders/${slider.id}`}>
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        className="px-4 py-2"
                                                        onClick={() =>
                                                            handleToggle(slider)
                                                        }
                                                    >
                                                        {slider.isActive
                                                            ? "Hide"
                                                            : "Show"}
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        className="px-4 py-2 text-red-700 focus:text-red-700 focus:bg-red-50"
                                                        onClick={() =>
                                                            setConfirm({
                                                                id: slider.id,
                                                            })
                                                        }
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}


                    </TableBody>
                </Table>
            </div>

            {confirm && (
                <ConfirmModal
                    open={!!confirm}
                    loading={loading}
                    title="Delete this slider?"
                    description="This action cannot be undone."
                    danger
                    onClose={() => setConfirm(null)}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
}