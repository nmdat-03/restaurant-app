import prisma from "@/lib/prisma";
import BannerSliderClient from "./BannerSliderClient";

export default async function BannerSlider() {
  const sliders = await prisma.slider.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return <BannerSliderClient sliders={sliders} />;
}