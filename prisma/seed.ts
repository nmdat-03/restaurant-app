import { PrismaClient } from "@prisma/client";

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
      },
    });
  }

  const categories = await prisma.category.findMany();

  // ===== PRODUCT =====
  for (let i = 1; i <= 30; i++) {
    const category = categories[i % categories.length];

    const randomImage = imagePool[Math.floor(Math.random() * imagePool.length)];

    await prisma.product.upsert({
      where: { slug: `product-${i}` },
      update: {},
      create: {
        name: `Product ${i}`,
        slug: `product-${i}`,
        description: `This is description of Product ${i}`,
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

  console.log("Done");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
