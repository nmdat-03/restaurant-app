import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) return null;

  const clerkUser = await currentUser();

  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null;

  const phone = clerkUser?.phoneNumbers?.[0]?.phoneNumber ?? null;

  const username = clerkUser?.username ?? null;

  const name =
    `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim() || null;

  const image = clerkUser?.imageUrl ?? null;

  const user = await prisma.user.upsert({
    where: {
      clerkId: userId,
    },

    update: {
      email,
      phone,
      username,
      name,
      image,
    },

    create: {
      clerkId: userId,
      email,
      phone,
      username,
      name,
      image,
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

  if (!user || user.role !== "ADMIN") {
    redirect("/sign-in");
  }

  return user;
}
