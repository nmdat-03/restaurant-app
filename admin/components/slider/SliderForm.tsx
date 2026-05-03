"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    InputField,
    TextareaField,
} from "@/components/common/FormField";
import UploadImages from "@/components/common/UploadImages";
import CustomButton from "@/components/common/CustomButton";

import {
    sliderSchema,
    SliderFormValues,
    SliderSubmitValues,
} from "@/lib/validators/slider";

export default function SliderForm({
    slider,
    isEdit = false,
}: {
    slider?: any;
    isEdit?: boolean;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [clearImages, setClearImages] = useState<() => void>(() => () => { });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<SliderFormValues>({
        resolver: zodResolver(sliderSchema),
        defaultValues: {
            image: {
                url: slider?.image || "",
                publicId: slider?.publicId || "",
            },
            link: slider?.link || "",
            sortOrder: slider?.sortOrder ?? 0,
            isActive: slider?.isActive ?? true,
        },
    });

    const image = watch("image");

    const onSubmit = async (data: SliderFormValues) => {
        setLoading(true);

        try {
            const parsed: SliderSubmitValues = sliderSchema.parse(data);

            const payload = {
                image: {
                    url: parsed.image.url,
                    publicId: parsed.image.publicId,
                },
                link: parsed.link,
                sortOrder: parsed.sortOrder,
                isActive: parsed.isActive,
            };

            const url = isEdit
                ? `/api/sliders/${slider.id}`
                : "/api/sliders";

            const method = isEdit ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                alert("Save failed");
                setLoading(false);
                return;
            }

            clearImages?.();

            router.push("/sliders");
        } catch (error) {
            console.log(error)
            alert("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-2xl bg-white border rounded-2xl p-4 space-y-5"
        >
            <h1 className="text-2xl font-bold">
                {isEdit ? "Edit Slider" : "Create Slider"}
            </h1>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Upload Banner
                </label>

                <UploadImages
                    images={image?.url ? [image] : []}
                    onChange={(imgs) =>
                        setValue(
                            "image",
                            imgs[0] || { url: "", publicId: "" },
                            { shouldValidate: true }
                        )
                    }
                    multiple={false}
                    onCleanupReady={setClearImages}
                />
            </div>

            <InputField
                label="Link"
                name="link"
                register={register}
                error={errors.link}
                placeholder="/products"
            />

            <div className="grid grid-cols-2 gap-4">
                <InputField
                    label="Sort Order"
                    name="sortOrder"
                    type="number"
                    register={register}
                    error={errors.sortOrder}
                />

                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                        Status
                    </label>

                    <label className="flex items-center gap-2 h-10">
                        <input
                            type="checkbox"
                            {...register("isActive")}
                            className="w-4 h-4 accent-green-500"
                        />
                        Active
                    </label>
                </div>
            </div>

            <CustomButton
                type="submit"
                disabled={loading || !image?.url}
                className="px-5 py-2 bg-black text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading
                    ? "Saving..."
                    : isEdit
                        ? "Update Slider"
                        : "Create Slider"}
            </CustomButton>
        </form>
    );
}