import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import CustomButton from "@/components/common/CustomButton";
import { ChevronLeft } from "lucide-react";
import SliderForm from "@/components/slider/SliderForm";

export default async function EditSliderPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
        redirect("/");
    }

    const { id } = await params;

    const slider = await prisma.slider.findUnique({
        where: { id },
    });

    if (!slider) {
        notFound();
    }

    return (
        <div className="w-full p-3 space-y-5">
            {/* Back */}
            <div>
                <Link href="/sliders">
                    <CustomButton className="flex items-center bg-white shadow-md rounded-full px-3 py-2 text-sm">
                        <ChevronLeft size={14} />
                        Back to sliders
                    </CustomButton>
                </Link>
            </div>

            <SliderForm slider={slider} isEdit />
        </div>
    );
}