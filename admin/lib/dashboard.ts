import prisma from "@/lib/prisma";
import { subDays, startOfDay } from "date-fns";
import { formatDateKey } from "./format";

/*=============== REVENUE CHART ===============*/
export async function getRevenueLast7Days() {
  const days = 7;

  const revenueData = await Promise.all(
    Array.from({ length: days }).map(async (_, i) => {
      const date = subDays(new Date(), i);
      const start = startOfDay(date);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const result = await prisma.order.aggregate({
        where: {
          createdAt: {
            gte: start,
            lt: end,
          },
          orderStatus: "COMPLETED",
          paymentStatus: "PAID",
        },
        _sum: { total: true },
      });

      return {
        date: formatDateKey(date),
        revenue: result._sum.total || 0,
      };
    }),
  );

  return revenueData.reverse();
}

/*=============== ORDERS CHART ===============*/
export async function getOrderStatsLast7Days() {
  const days = 7;

  const data = await Promise.all(
    Array.from({ length: days }).map(async (_, i) => {
      const date = subDays(new Date(), i);
      const start = startOfDay(date);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const [total, completed, cancelled] = await Promise.all([
        prisma.order.count({
          where: {
            createdAt: { gte: start, lt: end },
          },
        }),
        prisma.order.count({
          where: {
            createdAt: { gte: start, lt: end },
            orderStatus: "COMPLETED",
          },
        }),
        prisma.order.count({
          where: {
            createdAt: { gte: start, lt: end },
            orderStatus: "CANCELLED",
          },
        }),
      ]);

      return {
        date: formatDateKey(date),
        total,
        completed,
        cancelled,
      };
    }),
  );

  return data.reverse();
}

/*=============== TOP PRODUCTS ===============*/
export async function getTopProducts(limit = 10) {
  const top = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      order: {
        orderStatus: "COMPLETED",
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: limit,
  });

  const products = await prisma.product.findMany({
    where: {
      id: { in: top.map((item) => item.productId) },
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  return top.map((item) => {
    const product = productMap.get(item.productId);

    return {
      id: item.productId,
      name: product?.name || "Unknown",
      image: product?.images?.[0]?.url || "",
      sold: item._sum.quantity || 0,
    };
  });
}
