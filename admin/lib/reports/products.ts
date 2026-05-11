import prisma from "../prisma";

import { OrderStatus } from "@prisma/client";

type ProductReportItem = {
  quantity: number;
  price: number;

  order: {
    createdAt: Date;
    orderStatus: OrderStatus;
  };

  product: {
    id: string;
    name: string;
    price: number;
    isActive: boolean;

    category: {
      id: string;
      name: string;
    } | null;
  };
};

// ===== Fetch products report data =====
export async function getProductsReportData(from?: Date, to?: Date) {
  return prisma.orderItem.findMany({
    where: {
      order: {
        orderStatus: "COMPLETED",

        ...(from || to
          ? {
              createdAt: {
                ...(from && { gte: from }),
                ...(to && { lte: to }),
              },
            }
          : {}),
      },
    },

    select: {
      quantity: true,
      price: true,

      order: {
        select: {
          createdAt: true,
          orderStatus: true,
        },
      },

      product: {
        select: {
          id: true,
          name: true,
          price: true,
          isActive: true,

          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}

export async function getTotalProductsCount() {
  return prisma.product.count();
}

// ===== Group product sales =====
export function groupProductSales(items: ProductReportItem[]) {
  const map = new Map<
    string,
    {
      id: string;
      name: string;

      category: string;

      sold: number;

      revenue: number;

      active: boolean;
    }
  >();

  items.forEach((item) => {
    const productId = item.product.id;

    const current = map.get(productId) || {
      id: item.product.id,

      name: item.product.name,

      category: item.product.category?.name || "Uncategorized",

      sold: 0,

      revenue: 0,

      active: item.product.isActive,
    };

    current.sold += item.quantity;

    current.revenue += item.quantity * item.price;

    map.set(productId, current);
  });

  return Array.from(map.values());
}

// ===== Product stats =====
export function getProductStats(
  products: {
    sold: number;
    revenue: number;
    active: boolean;
  }[],
) {
  const stats = {
    totalProducts: products.length,

    totalSold: 0,

    totalRevenue: 0,

    activeProducts: 0,

    inactiveProducts: 0,
  };

  products.forEach((product) => {
    stats.totalSold += product.sold;

    stats.totalRevenue += product.revenue;

    if (product.active) {
      stats.activeProducts++;
    } else {
      stats.inactiveProducts++;
    }
  });

  return stats;
}

// ===== Top selling products =====
export function getTopSellingProducts(
  products: {
    id: string;
    name: string;
    sold: number;
    revenue: number;
  }[],
  limit = 5,
) {
  return [...products].sort((a, b) => b.sold - a.sold).slice(0, limit);
}

// ===== All-time top products =====
export async function getAllTimeTopProducts(limit = 5) {
  const items = await prisma.orderItem.findMany({
    where: {
      order: {
        orderStatus: "COMPLETED",
      },
    },

    select: {
      quantity: true,

      product: {
        select: {
          id: true,
          name: true,

          images: {
            take: 1,

            select: {
              url: true,
            },
          },
        },
      },
    },
  });

  const map = new Map<
    string,
    {
      id: string;
      name: string;
      image?: string;
      sold: number;
    }
  >();

  items.forEach((item) => {
    const current = map.get(item.product.id) || {
      id: item.product.id,
      name: item.product.name,
      image: item.product.images[0]?.url,
      sold: 0,
    };

    current.sold += item.quantity;

    map.set(item.product.id, current);
  });

  return [...map.values()].sort((a, b) => b.sold - a.sold).slice(0, limit);
}

// ===== Top revenue products =====
export function getTopRevenueProducts(
  products: {
    id: string;
    name: string;
    sold: number;
    revenue: number;
  }[],
  limit = 5,
) {
  return [...products].sort((a, b) => b.revenue - a.revenue).slice(0, limit);
}

// ===== Category stats =====
export function getCategoryStats(
  products: {
    category: string;
    sold: number;
  }[],
) {
  const map = new Map<string, number>();

  products.forEach((product) => {
    const current = map.get(product.category) || 0;

    map.set(product.category, current + product.sold);
  });

  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

// ===== Average order item value =====
export function getAverageSellingPrice(
  totalRevenue: number,
  totalSold: number,
) {
  if (totalSold === 0) {
    return 0;
  }

  return Math.round(totalRevenue / totalSold);
}
