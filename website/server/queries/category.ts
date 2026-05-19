import prisma from "@/lib/prisma";

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    select: {
      id: true,
      image: true,
      name: true,
      slug: true,
    },
    orderBy: { name: "asc" },
  });
}
