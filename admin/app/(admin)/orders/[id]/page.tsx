import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
    formatOrderTime,
    formatPrice,
} from "@/lib/format";
import Link from "next/link";
import UpdateOrderButton from "@/components/common/UpdateOrderButton";
import CustomButton from "@/components/common/CustomButton";
import { ChevronLeft } from "lucide-react";
import {
    OrderStatusBadge,
    PaymentStatusBadge,
} from "@/components/common/Badges";

export default async function AdminOrderDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ from?: string }>;
}) {
    const user = await getCurrentUser();

    if (
        !user ||
        user.role !== "ADMIN"
    ) {
        redirect("/");
    }

    const { id } = await params;

    const { from } = await searchParams;

    const order =
        await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        });

    if (!order) return notFound();

    const paymentMethodLabel =
        order.paymentMethod === "COD"
            ? "Cash on delivery (COD)"
            : order.paymentMethod === "VNPAY"
                ? "Online payment (VNPAY)"
                : order.paymentMethod;

    return (
        <div className="w-full px-6 py-6 space-y-5">
            {/* Back */}
            <div>
                <Link href={from || "/orders"}>
                    <CustomButton className="flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm shadow-md">
                        <ChevronLeft size={14} />
                        {from?.startsWith("/users") ? "Back to user" : "Back to orders"}
                    </CustomButton>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* ORDER INFO */}
                <div className="relative space-y-4 rounded-xl bg-white p-5 shadow-md overflow-hidden">
                    <div className="absolute left-0 top-0 w-full h-1 bg-linear-to-b from-green-300 to-green-500" />
                    <h2 className="text-lg font-semibold">
                        Order Info
                    </h2>

                    <div className="space-y-3 text-sm">
                        <p>
                            <span className="font-medium text-gray-500">
                                Order ID:
                            </span>{" "}
                            {order.id}
                        </p>

                        <p>
                            <span className="font-medium text-gray-500">
                                Order Time:
                            </span>{" "}
                            {formatOrderTime(order.createdAt)}
                        </p>

                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-500">
                                Status:
                            </span>
                            <OrderStatusBadge status={order.orderStatus} />
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-500">
                                Payment:
                            </span>
                            <PaymentStatusBadge status={order.paymentStatus} />
                        </div>

                        <p>
                            <span className="font-medium text-gray-500">
                                Method:
                            </span>{" "}
                            {paymentMethodLabel}
                        </p>

                        <p>
                            <span className="font-medium text-gray-500">
                                Total:</span>{" "}
                            {formatPrice(order.total)}
                        </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
                        {order.orderStatus === "PENDING" && (
                            <>
                                <UpdateOrderButton
                                    id={order.id}
                                    status="CONFIRMED"
                                    label="Confirm"
                                    variant="confirm"
                                />

                                <UpdateOrderButton
                                    id={order.id}
                                    status="CANCELLED"
                                    label="Cancel"
                                    variant="cancel"
                                />
                            </>
                        )}

                        {order.orderStatus === "CONFIRMED" && (
                                <>
                                    <UpdateOrderButton
                                        id={order.id}
                                        status="SHIPPING"
                                        label="Ship"
                                        variant="ship"
                                    />

                                    <UpdateOrderButton
                                        id={order.id}
                                        status="CANCELLED"
                                        label="Cancel"
                                        variant="cancel"
                                    />
                                </>
                            )}

                        {order.orderStatus === "SHIPPING" && (
                                <UpdateOrderButton
                                    id={order.id}
                                    status="COMPLETED"
                                    label="Complete"
                                    variant="complete"
                                />
                            )}
                    </div>
                </div>

                {/* USER / RECEIVER */}
                <div className="relative space-y-4 rounded-xl bg-white p-5 shadow-md overflow-hidden">
                    <div className="absolute left-0 top-0 w-full h-1 bg-linear-to-b from-blue-300 to-blue-500" />
                    <div>
                        <h2 className="text-lg font-semibold">
                            User
                        </h2>

                        <p className="mt-2 text-sm text-gray-600">
                            {order.user?.email || order.user?.phone}
                        </p>
                    </div>

                    <div className="border-t pt-4">
                        <h2 className="text-lg font-semibold">
                            Receiver
                        </h2>

                        <div className="mt-2 space-y-2 text-sm text-gray-600">
                            <p>Full name:{" "}{order.fullName}</p>
                            <p>Phone:{" "}{order.phone}</p>
                            <p>Address:{" "}{order.address}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ITEMS */}
            <div className="space-y-4 rounded-xl bg-white p-5 shadow-md">
                <h2 className="text-lg font-semibold">
                    Items
                </h2>

                {order.items.map((item) => (
                    <div key={item.id} className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium">
                                    {item.product?.name || "Product deleted"}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Quantity: x{item.quantity}
                                </p>
                            </div>

                            <p className="text-sm font-medium">
                                {formatPrice(item.price)}
                            </p>
                        </div>

                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Subtotal</span>
                            <span>
                                {formatPrice(item.price * item.quantity)}
                            </span>
                        </div>

                        <div className="border" />
                    </div>
                ))}

                <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-500">Total:</span>
                    <span className="text-2xl font-bold">
                        {formatPrice(order.total)}
                    </span>
                </div>
            </div>
        </div>
    );
}