"use client";

import Link from "next/link";
import { Prisma, OrderStatus } from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatPrice, formatOrderDate, formatOrderHour } from "@/lib/format";
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock, MoreHorizontal } from "lucide-react";

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

type OrdersTableProps = {
    orders: OrderWithUser[];
    showActions?: boolean;
    onAction?: (id: string, status: OrderStatus) => void;
};

export default function OrdersTable({
    orders,
    showActions = false,
    onAction,
}: OrdersTableProps) {
    return (
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
                        {showActions && (
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        )}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={showActions ? 8 : 7}
                                className="py-10 text-center text-gray-500"
                            >
                                No orders found
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order) => (
                            <TableRow key={order.id}>
                                {/* Order ID */}
                                <TableCell className="font-medium">
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="hover:underline"
                                    >
                                        #{order.id.slice(-6).toUpperCase()}
                                    </Link>
                                </TableCell>

                                {/* Customer */}
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

                                {/* Items */}
                                <TableCell>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button className="text-sm hover:underline">
                                                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "} items
                                                </button>
                                            </TooltipTrigger>

                                            <TooltipContent
                                                side="top"
                                                className="max-w-xs"
                                            >
                                                <div className="space-y-1 text-sm">
                                                    {order.items.map((item) => (
                                                        <p key={item.id}>
                                                            {item.product.name} x{item.quantity}
                                                        </p>
                                                    ))}
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>

                                {/* Total */}
                                <TableCell className="font-medium">
                                    {formatPrice(order.total)}
                                </TableCell>

                                {/* Payment */}
                                <TableCell>
                                    <PaymentStatusBadge
                                        status={order.paymentStatus}
                                    />
                                </TableCell>

                                {/* Status */}
                                <TableCell>
                                    <OrderStatusBadge
                                        status={order.orderStatus}
                                    />
                                </TableCell>

                                {/* Time */}
                                <TableCell className="text-sm">
                                    <div className="flex flex-col">
                                        <span>{formatOrderDate(order.createdAt)}</span>

                                        <span className="flex gap-1 items-center text-xs text-gray-500">
                                            <Clock size={12} />
                                            <p>{formatOrderHour(order.createdAt)}</p>
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Actions */}
                                {showActions && onAction && (
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
                                                {order.orderStatus ===
                                                    OrderStatus.PENDING && (
                                                        <>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    onAction(
                                                                        order.id,
                                                                        OrderStatus.CONFIRMED
                                                                    )
                                                                }
                                                            >
                                                                Confirm
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() =>
                                                                    onAction(
                                                                        order.id,
                                                                        OrderStatus.CANCELLED
                                                                    )
                                                                }
                                                            >
                                                                Cancel
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}

                                                {order.orderStatus ===
                                                    OrderStatus.CONFIRMED && (
                                                        <>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    onAction(
                                                                        order.id,
                                                                        OrderStatus.SHIPPING
                                                                    )
                                                                }
                                                            >
                                                                Ship
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() =>
                                                                    onAction(
                                                                        order.id,
                                                                        OrderStatus.CANCELLED
                                                                    )
                                                                }
                                                            >
                                                                Cancel
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}

                                                {order.orderStatus ===
                                                    OrderStatus.SHIPPING && (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                onAction(
                                                                    order.id,
                                                                    OrderStatus.COMPLETED
                                                                )
                                                            }
                                                        >
                                                            Complete
                                                        </DropdownMenuItem>
                                                    )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}


                </TableBody>
            </Table>
        </div>
    );
}