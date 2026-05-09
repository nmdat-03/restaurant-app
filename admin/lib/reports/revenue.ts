import prisma from "../prisma";
import { getGroupKey } from "./helpers";
import { GroupBy } from "./types";

// ===== Fetch data =====
export async function getRevenueData(from?: Date, to?: Date) {
  return prisma.order.findMany({
    where: {
      orderStatus: "COMPLETED",
      paymentStatus: "PAID",

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
      total: true,
    },
  });
}

// ===== Group revenue =====
export function groupRevenue(
  orders: {
    createdAt: Date;
    total: number;
  }[],
  groupBy: GroupBy,
  from?: Date,
  to?: Date,
) {
  const map = new Map<string, number>();

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

      map.set(key, 0);

      if (groupBy === "day") {
        current.setDate(current.getDate() + 1);
      } else if (groupBy === "month") {
        current.setMonth(current.getMonth() + 1);
      } else {
        current.setFullYear(current.getFullYear() + 1);
      }
    }
  }

  // ===== Add revenue =====
  orders.forEach((order) => {
    const key = getGroupKey(order.createdAt, groupBy);

    const amount = Number(order.total) || 0;

    map.set(key, (map.get(key) || 0) + amount);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, revenue]) => ({ date, revenue }));
}
