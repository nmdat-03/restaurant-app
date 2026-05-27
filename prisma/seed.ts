import {
  PrismaClient,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Role,
} from "@prisma/client";

const prisma = new PrismaClient();

// ===== CATEGORY IMAGES =====
const categoryImages = {
  mainDish:
    "https://res.cloudinary.com/nmd2910/image/upload/v1777779760/plmxgjxm3bbcweursx1o.avif",

  dessert:
    "https://res.cloudinary.com/nmd2910/image/upload/v1777779748/c26qmnofvqtjsnhlyeyb.avif",

  drink:
    "https://res.cloudinary.com/nmd2910/image/upload/v1777780697/pf77kdzi4b5rhunahpdm.avif",

  appetizer:
    "https://res.cloudinary.com/nmd2910/image/upload/v1777780664/yd4dxddv4qwlfcotu4ue.webp",

  combo:
    "https://res.cloudinary.com/nmd2910/image/upload/v1777779735/ngpm8efq2ybsmonms1ks.jpg",
};

// ===== DISH IMAGES =====

// Main dishes
const mainDishImages = [
  "https://res.cloudinary.com/nmd2910/image/upload/v1779847245/hc7613gufoislacxijqz.jpg",
  "https://res.cloudinary.com/nmd2910/image/upload/v1779847246/ddmpmte5matdflap1xjm.jpg",
  "https://res.cloudinary.com/nmd2910/image/upload/v1779847246/fcbz7aibajz3lgp4nwj6.jpg",
  "https://res.cloudinary.com/nmd2910/image/upload/v1779847246/vdvlfarsf24i84c9elov.jpg",
  "https://res.cloudinary.com/nmd2910/image/upload/v1779847247/ltkz5okasa5vrnsqr6tz.jpg",
  "https://res.cloudinary.com/nmd2910/image/upload/v1779847247/xjnc0dfqw1rlnxlosd1s.jpg",
  "https://res.cloudinary.com/nmd2910/image/upload/v1779847248/ttlg7qjldkxrlruytc75.jpg",
  "https://res.cloudinary.com/nmd2910/image/upload/v1779847248/m4maz5flehah9yjnc87o.jpg",
  "https://res.cloudinary.com/nmd2910/image/upload/v1779847253/fygdl8hxhlccfg3ulj8v.jpg",
];

// Desserts
const dessertImages = [
  "https://res.cloudinary.com/nmd2910/image/upload/v1779847249/xcosfj9rwuxp3lahlfhm.jpg",
  "https://res.cloudinary.com/nmd2910/image/upload/v1779847247/v5zizpt50xngp0kwfda3.jpg",
  "https://res.cloudinary.com/nmd2910/image/upload/v1779847247/nvjf8o9sklwenudg6ty9.jpg",
  "https://res.cloudinary.com/nmd2910/image/upload/v1779847246/amts10fjuq8fxecs4irp.jpg",
];

// Drinks
const drinkImages = [
  "https://res.cloudinary.com/nmd2910/image/upload/v1779847246/xjpovxzzfvizmgryjnun.jpg",
  "https://res.cloudinary.com/nmd2910/image/upload/v1779847248/rxa1xkuq1jghdc7efpsx.jpg",
  "https://res.cloudinary.com/nmd2910/image/upload/v1779847249/nolq9ihbvwywp6jb0s1n.png",
];

// ===== CATEGORY DATA =====
const categories = [
  {
    name: "Main Dishes",
    slug: "main-dishes",
    image: categoryImages.mainDish,
  },
  {
    name: "Desserts",
    slug: "desserts",
    image: categoryImages.dessert,
  },
  {
    name: "Drinks",
    slug: "drinks",
    image: categoryImages.drink,
  },
  {
    name: "Appetizers",
    slug: "appetizers",
    image: categoryImages.appetizer,
  },
  {
    name: "Combos",
    slug: "combos",
    image: categoryImages.combo,
  },
];

const orderStatuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "COMPLETED",
  "CANCELLED",
];

function randomPrice(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min) * 1000;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("Start seeding...");

  // ===== RESET DATABASE =====

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();

  await prisma.category.deleteMany();

  await prisma.user.deleteMany({
    where: {
      clerkId: "seed-user",
    },
  });

  // ===== CREATE CATEGORIES =====

  for (const category of categories) {
    await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        image: category.image,
        isActive: true,
      },
    });
  }

  const createdCategories = await prisma.category.findMany();

  const mainDishCategory = createdCategories.find(
    (c) => c.slug === "main-dishes",
  )!;

  const dessertCategory = createdCategories.find((c) => c.slug === "desserts")!;

  const drinkCategory = createdCategories.find((c) => c.slug === "drinks")!;

  const appetizerCategory = createdCategories.find(
    (c) => c.slug === "appetizers",
  )!;

  const comboCategory = createdCategories.find((c) => c.slug === "combos")!;

  // ===== MAIN DISHES =====

  for (let i = 1; i <= 12; i++) {
    await prisma.product.create({
      data: {
        name: `Main Dish ${i}`,
        slug: `main-dish-${i}`,
        description: `Delicious main dish ${i}`,
        price: randomPrice(50, 150),
        categoryId: mainDishCategory.id,

        images: {
          create: [
            {
              url: randomItem(mainDishImages),
              isPrimary: true,
            },
          ],
        },
      },
    });
  }

  // ===== DESSERTS =====

  for (let i = 1; i <= 6; i++) {
    await prisma.product.create({
      data: {
        name: `Dessert ${i}`,
        slug: `dessert-${i}`,
        description: `Sweet dessert ${i}`,
        price: randomPrice(20, 60),
        categoryId: dessertCategory.id,

        images: {
          create: [
            {
              url: randomItem(dessertImages),
              isPrimary: true,
            },
          ],
        },
      },
    });
  }

  // ===== DRINKS =====

  for (let i = 1; i <= 6; i++) {
    await prisma.product.create({
      data: {
        name: `Drink ${i}`,
        slug: `drink-${i}`,
        description: `Refreshing drink ${i}`,
        price: randomPrice(15, 45),
        categoryId: drinkCategory.id,

        images: {
          create: [
            {
              url: randomItem(drinkImages),
              isPrimary: true,
            },
          ],
        },
      },
    });
  }

  // ===== APPETIZERS =====

  for (let i = 1; i <= 4; i++) {
    await prisma.product.create({
      data: {
        name: `Appetizer ${i}`,
        slug: `appetizer-${i}`,
        description: `Tasty appetizer ${i}`,
        price: randomPrice(25, 70),
        categoryId: appetizerCategory.id,

        images: {
          create: [
            {
              url: randomItem(mainDishImages),
              isPrimary: true,
            },
          ],
        },
      },
    });
  }

  // ===== COMBOS =====

  for (let i = 1; i <= 4; i++) {
    await prisma.product.create({
      data: {
        name: `Combo ${i}`,
        slug: `combo-${i}`,
        description: `Special combo ${i}`,
        price: randomPrice(120, 250),
        categoryId: comboCategory.id,

        images: {
          create: [
            {
              url: randomItem(mainDishImages),
              isPrimary: true,
            },
          ],
        },
      },
    });
  }

  // ===== USER =====

  const user = await prisma.user.create({
    data: {
      clerkId: "seed-user",
      name: "Seed User",
      email: "seed@example.com",
      role: Role.USER,
    },
  });

  const products = await prisma.product.findMany();

  // ===== ORDERS =====

  for (let i = 1; i <= 25; i++) {
    const status = randomItem(orderStatuses);

    const createdAt = new Date();

    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 7));

    const shuffledProducts = [...products].sort(() => 0.5 - Math.random());

    const selectedProducts = shuffledProducts.slice(
      0,
      Math.floor(Math.random() * 3) + 1,
    );

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

  console.log("Seed completed successfully");
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
