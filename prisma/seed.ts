import {
  PrismaClient,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Role,
} from "@prisma/client";

const prisma = new PrismaClient();

const imagePool = [
  {
    url: "https://res.cloudinary.com/nmd2910/image/upload/v1777779760/plmxgjxm3bbcweursx1o.avif",
  },
  {
    url: "https://res.cloudinary.com/nmd2910/image/upload/v1777779748/c26qmnofvqtjsnhlyeyb.avif",
  },
  {
    url: "https://res.cloudinary.com/nmd2910/image/upload/v1777779735/ngpm8efq2ybsmonms1ks.jpg",
  },
  {
    url: "https://res.cloudinary.com/nmd2910/image/upload/v1777780664/yd4dxddv4qwlfcotu4ue.webp",
  },
  {
    url: "https://res.cloudinary.com/nmd2910/image/upload/v1777780697/pf77kdzi4b5rhunahpdm.avif",
  },
];

const orderStatuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "COMPLETED",
  "CANCELLED",
];

async function main() {
  console.log("Start seeding...");

  // ===== CATEGORY =====
  for (let i = 1; i <= 5; i++) {
    await prisma.category.upsert({
      where: { slug: `category-${i}` },
      update: {},
      create: {
        name: `Category ${i}`,
        slug: `category-${i}`,
        image: imagePool[i % imagePool.length].url,
        isActive: true,
      },
    });
  }

  const categories = await prisma.category.findMany();

  // ===== PRODUCT =====
  for (let i = 1; i <= 30; i++) {
    const category = categories[(i - 1) % categories.length];

    const randomImage = imagePool[Math.floor(Math.random() * imagePool.length)];

    await prisma.product.upsert({
      where: { slug: `product-${i}` },
      update: {},
      create: {
        name: `Dish ${i}`,
        slug: `dish-${i}`,
        description: `This is description of Dish ${i}`,
        price: Math.floor(Math.random() * 90 + 10) * 1000,
        categoryId: category.id,
        images: {
          create: [
            {
              url: randomImage.url,
              isPrimary: true,
            },
          ],
        },
      },
    });
  }

  // ===== USER =====
  const user = await prisma.user.upsert({
    where: { clerkId: "seed-user" },
    update: {},
    create: {
      clerkId: "seed-user",
      name: "Seed User",
      email: "seed@example.com",
      role: Role.USER,
    },
  });

  const products = await prisma.product.findMany();

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  // ===== ORDERS =====
  for (let i = 1; i <= 25; i++) {
    const status = orderStatuses[i % orderStatuses.length];

    const daysAgo = Math.floor(Math.random() * 7);

    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    const itemCount = Math.floor(Math.random() * 3) + 1;

    const shuffled = [...products].sort(() => 0.5 - Math.random());

    const selectedProducts = shuffled.slice(0, itemCount);

    let total = 0;

    const itemsData = selectedProducts.map((product) => {
      const quantity = Math.floor(Math.random() * 3) + 1;

      total += product.price * quantity;

      return {
        productId: product.id,
        quantity,
        price: product.price,
      };
    });

    await prisma.order.create({
      data: {
        userId: user.id,
        fullName: "Nguyen Van A",
        phone: "0901234567",
        address: "Ho Chi Minh City",
        paymentMethod: PaymentMethod.COD,
        paymentStatus:
          status === "COMPLETED"
            ? PaymentStatus.PAID
            : status === "CANCELLED"
              ? PaymentStatus.FAILED
              : PaymentStatus.PENDING,
        orderStatus: status,
        total,
        paidAt: status === "COMPLETED" ? createdAt : null,
        deliveredAt: status === "COMPLETED" ? createdAt : null,
        createdAt,
        items: { create: itemsData },
      },
    });
  }

  console.log("Done");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
