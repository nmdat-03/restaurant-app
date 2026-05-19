"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  InputField,
  SelectField,
} from "../common/FormField";

import UploadImages from "../common/UploadImages";
import CustomButton from "../common/CustomButton";

import {
  categorySchema,
  CategoryFormValues,
  CategorySubmitValues,
} from "@/lib/validators/category";

export default function CategoryForm({
  categories,
  category,
  isEdit = false,
}: {
  categories: any[];
  category?: any;
  isEdit?: boolean;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),

    defaultValues: {
      name: category?.name || "",
      image: category?.image || "",
      parentId: category?.parentId || "",
    },
  });

  const image = watch("image");

  const onSubmit = async (
    data: CategoryFormValues
  ) => {
    setLoading(true);

    try {
      const parsed: CategorySubmitValues =
        categorySchema.parse(data);

      const payload = {
        ...parsed,
        slug: slugify(parsed.name),
        parentId: parsed.parentId || null,
      };

      const url = isEdit
        ? `/api/categories/${category.id}`
        : "/api/categories";

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Save failed");
        setLoading(false);

        return;
      }

      router.push("/categories");

      router.refresh();
    } catch {
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
        {isEdit
          ? "Edit Category"
          : "Add Category"}
      </h1>

      {/* IMAGE */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Upload Image
        </label>

        <UploadImages
          images={image ? [{ url: image }] : []}
          onChange={(imgs) =>
            setValue(
              "image",
              imgs?.[0]?.url || "",
              {
                shouldValidate: true,
              }
            )
          }
          multiple={false}
          max={1}
        />
      </div>

      {/* NAME */}
      <InputField
        label="Category Name"
        name="name"
        register={register}
        error={errors.name}
      />

      {/* PARENT CATEGORY */}
      <SelectField
        label="Parent Category"
        name="parentId"
        register={register}
        error={errors.parentId}
        options={[
          {
            label: "No parent",
            value: "",
          },

          ...categories.map((item: any) => ({
            label: item.name,
            value: item.id,
          })),
        ]}
      />

      {/* SUBMIT */}
      <CustomButton
        type="submit"
        disabled={loading}
        className="px-5 py-2 bg-linear-to-t from-slate-900 via-slate-800 to-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? "Saving..."
          : isEdit
            ? "Update Category"
            : "Create Category"}
      </CustomButton>
    </form>
  );
}