import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import CustomButton from "@/components/common/CustomButton";
import { ChevronLeft } from "lucide-react";
import SliderForm from "@/components/slider/SliderForm";

export default async function CreateSliderPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="w-full p-3 space-y-5">
      <div>
        <Link href="/sliders">
          <CustomButton className="flex items-center bg-white shadow-md rounded-full px-3 py-2 text-sm">
            <ChevronLeft size={14} />
            Back to sliders
          </CustomButton>
        </Link>
      </div>

      <SliderForm />
    </div>
  );
}