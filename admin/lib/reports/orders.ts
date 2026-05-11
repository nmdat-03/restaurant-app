import prisma from "../prisma";

import { OrderStatus, PaymentMethod } from "@prisma/client";

import { getGroupKey } from "./helpers";

import { GroupBy } from "./types";

// ===== Fetch orders data =====
export async function getOrdersReportData(from?: Date, to?: Date) {
  return prisma.order.findMany({
    where: {
      ...(from || to
        ? {
            createdAt: {
              ...(from && { gte: from }),
              ...(to && { lte: to }),
            },
          }
        : {}),
    },

    select: {
      createdAt: true,
      orderStatus: true,
      paymentMethod: true,
      total: true,
    },
  });
}

// ===== Group orders =====
export function groupOrders(
  orders: {
    createdAt: Date;
    orderStatus: OrderStatus;
  }[],
  groupBy: GroupBy,
  from?: Date,
  to?: Date,
) {
  const map = new Map<
    string,
    {
      total: number;
      completed: number;
      cancelled: number;
    }
  >();

  // ===== Fill empty periods =====
  if (from && to) {
    const current = new Date(from);

    if (groupBy === "month") {
      current.setDate(1);
    }

    if (groupBy === "year") {
      current.setMonth(0, 1);
    }

    const endDate = new Date(to);

    while (current <= endDate) {
      const key = getGroupKey(current, groupBy);

      map.set(key, {
        total: 0,
        completed: 0,
        cancelled: 0,
      });

      if (groupBy === "day") {
        current.setDate(current.getDate() + 1);
      } else if (groupBy === "month") {
        current.setMonth(current.getMonth() + 1);
      } else {
        current.setFullYear(current.getFullYear() + 1);
      }
    }
  }

  // ===== Count orders =====
  orders.forEach((order) => {
    const key = getGroupKey(order.createdAt, groupBy);

    const current = map.get(key) || {
      total: 0,
      completed: 0,
      cancelled: 0,
    };

    current.total++;

    if (order.orderStatus === "COMPLETED") {
      current.completed++;
    }

    if (order.orderStatus === "CANCELLED") {
      current.cancelled++;
    }

    map.set(key, current);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, stats]) => ({
      date,
      ...stats,
    }));
}

// ===== Order status stats =====
export function getOrderStatusStats(
  orders: {
    orderStatus: OrderStatus;
  }[],
) {
  const stats = {
    total: orders.length,

    completed: 0,

    pending: 0,

    confirmed: 0,

    shipping: 0,

    cancelled: 0,
  };

  orders.forEach((order) => {
    switch (order.orderStatus) {
      case "COMPLETED":
        stats.completed++;
        break;

      case "PENDING":
        stats.pending++;
        break;

      case "CONFIRMED":
        stats.confirmed++;
        break;

      case "SHIPPING":
        stats.shipping++;
        break;

      case "CANCELLED":
        stats.cancelled++;
        break;
    }
  });

  return stats;
}

// ===== Completion rate =====
export function getCompletionRate(completed: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Number(((completed / total) * 100).toFixed(1));
}

// ===== Payment method stats =====
export function getPaymentMethodStats(
  orders: {
    paymentMethod: PaymentMethod | null;
  }[],
) {
  const stats = {
    cod: 0,
    vnpay: 0,
  };

  orders.forEach((order) => {
    switch (order.paymentMethod) {
      case "COD":
        stats.cod++;
        break;

      case "VNPAY":
        stats.vnpay++;
        break;
    }
  });

  return stats;
}
