"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { OrderStatus, Prisma } from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatPrice, formatOrderTime } from "@/lib/format";
import {
    OrderStatusBadge,
    PaymentStatusBadge,
} from "@/components/common/Badges";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal } from "lucide-react";
import AdminSearchBar from "@/components/common/AdminSearchBar";
import ConfirmModal from "@/components/common/ConfirmModal";

type OrderWithUser = Prisma.OrderGetPayload<{
    include: {
        user: true;
        items: {
            include: {
                product: true;
            };
        };
    };
}>;

type ConfirmState = {
    id: string;
    status: OrderStatus;
} | null;

export default function AdminOrdersClient({
    orders,
}: {
    orders: OrderWithUser[];
}) {
    const [loading, setLoading] = useState(false);

    const [orderList, setOrderList] = useState<OrderWithUser[]>(orders);

    const [confirm, setConfirm] = useState<ConfirmState>(null);

    const sortedOrders = useMemo(() => orderList, [orderList]);

    const updateLocalOrder = (updatedOrder: OrderWithUser) => {
        setOrderList((prev) =>
            prev.map((item) =>
                item.id === updatedOrder.id ? updatedOrder : item
            )
        );
    };

    const handleQuickUpdate = async (
        id: string,
        status: OrderStatus
    ) => {
        const res = await fetch(`/api/orders/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderStatus: status }),
        });

        if (!res.ok) return;

        const updatedOrder = await res.json();

        updateLocalOrder(updatedOrder);
    };

    const handleConfirmSubmit = async () => {
        if (!confirm) return;

        try {
            setLoading(true);

            const res = await fetch(`/api/orders/${confirm.id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderStatus: confirm.status, }),
                }
            );

            if (!res.ok) return;

            const updatedOrder =
                await res.json();

            updateLocalOrder(updatedOrder);

            setConfirm(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5">

            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-200 hover:bg-gray-200">
                            <TableHead>Order</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Order Time</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {sortedOrders.map(
                            (order) => (
                                <TableRow
                                    key={order.id}
                                >
                                    <TableCell className="font-medium">
                                        <Link
                                            href={`/orders/${order.id}`}
                                            className="hover:underline"
                                        >
                                            #{order.id.slice(-6).toUpperCase()}
                                        </Link>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <p className="font-medium">
                                                {order.fullName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {order.phone}
                                            </p>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="space-y-1 text-sm">
                                            {order.items.slice(0, 2).map((item) => (
                                                <p key={item.id}>
                                                    {item.product.name}{" "}
                                                    x
                                                    {item.quantity}
                                                </p>
                                            )
                                            )}

                                            {order.items.length > 2 && (
                                                <p className="text-xs text-gray-400">
                                                    +{order.items.length - 2}{" "}more
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="font-medium">
                                        {formatPrice(order.total)}
                                    </TableCell>

                                    <TableCell>
                                        <PaymentStatusBadge status={order.paymentStatus} />
                                    </TableCell>

                                    <TableCell>
                                        <OrderStatusBadge status={order.orderStatus} />
                                    </TableCell>

                                    <TableCell className="text-sm">
                                        {formatOrderTime(order.createdAt)}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-gray-100">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end" className="w-44">
                                                {order.orderStatus === OrderStatus.PENDING && (
                                                    <>
                                                        <DropdownMenuItem
                                                            className="px-4 py-2 text-blue-700 focus:text-blue-700 focus:bg-blue-50"
                                                            onClick={() =>
                                                                handleQuickUpdate(
                                                                    order.id,
                                                                    OrderStatus.CONFIRMED
                                                                )
                                                            }
                                                        >
                                                            Confirm
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            className="px-4 py-2 text-red-700 focus:text-red-700 focus:bg-red-50"
                                                            onClick={() =>
                                                                setConfirm({
                                                                    id: order.id,
                                                                    status: OrderStatus.CANCELLED,
                                                                })
                                                            }
                                                        >
                                                            Cancel
                                                        </DropdownMenuItem>
                                                    </>
                                                )}

                                                {order.orderStatus === OrderStatus.CONFIRMED && (
                                                    <>
                                                        <DropdownMenuItem
                                                            className="px-4 py-2 text-purple-700 focus:text-purple-700 focus:bg-purple-50"
                                                            onClick={() =>
                                                                handleQuickUpdate(
                                                                    order.id,
                                                                    OrderStatus.SHIPPING
                                                                )
                                                            }
                                                        >
                                                            Ship
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            className="px-4 py-2 not-odd:text-red-500 focus:text-red-500 focus:bg-red-50"
                                                            onClick={() =>
                                                                setConfirm({
                                                                    id: order.id,
                                                                    status: OrderStatus.CANCELLED,
                                                                })
                                                            }
                                                        >
                                                            Cancel
                                                        </DropdownMenuItem>
                                                    </>
                                                )}

                                                {order.orderStatus === OrderStatus.SHIPPING && (
                                                    <DropdownMenuItem
                                                        className="px-4 py-2 text-green-700 focus:text-green-700 focus:bg-green-50"
                                                        onClick={() =>
                                                            setConfirm({
                                                                id: order.id,
                                                                status: OrderStatus.COMPLETED,
                                                            })
                                                        }
                                                    >
                                                        Complete
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        )}

                        {sortedOrders.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="py-10 text-center text-gray-500"
                                >
                                    No orders found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {confirm && (
                <ConfirmModal
                    open={!!confirm}
                    loading={loading}
                    title={
                        confirm?.status === OrderStatus.CANCELLED
                            ? "Cancel order?"
                            : "Complete order?"
                    }
                    description={
                        confirm?.status === OrderStatus.CANCELLED
                            ? "This action cannot be undone."
                            : "Mark this order as delivered successfully."
                    }
                    danger={confirm?.status === OrderStatus.CANCELLED}
                    onClose={() => setConfirm(null)}
                    onConfirm={handleConfirmSubmit}
                />
            )}
        </div>
    );
}