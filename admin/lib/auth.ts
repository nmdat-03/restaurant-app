import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },

    select: {
      id: true,
      clerkId: true,
      username: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
  });

  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return user;
}
