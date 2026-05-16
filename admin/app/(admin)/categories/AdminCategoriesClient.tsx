"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Eye, EyeOff, SquarePen } from "lucide-react";

import { ProductStatusBadge } from "@/components/common/Badges";

export default function AdminCategoriesClient({
  categories,
}: {
  categories: any[];
}) {
  const [categoryList, setCategoryList] = useState(categories);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === categoryList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(categoryList.map((c) => c.id));
    }
  };

  const bulkUpdate = async (isActive: boolean) => {
    if (!selectedIds.length) return;

    setLoading(true);

    // optimistic update
    setCategoryList((prev) =>
      prev.map((category) =>
        selectedIds.includes(category.id)
          ? { ...category, isActive }
          : category
      )
    );

    try {
      await fetch("/api/categories/bulk", {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ids: selectedIds,
          isActive,
        }),
      });

      setSelectedIds([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* ACTIONS */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex gap-2 items-center">
          {categoryList
            .filter((c) => selectedIds.includes(c.id))
            .some((c) => !c.isActive) && (
              <button
                onClick={() => bulkUpdate(true)}
                disabled={!selectedIds.length || loading}
                className="px-4 py-2 border border-black rounded-md flex gap-2 items-center text-sm disabled:opacity-50"
              >
                <Eye size={16} />
                Show Selected
              </button>
            )}

          {categoryList
            .filter((c) => selectedIds.includes(c.id))
            .some((c) => c.isActive) && (
              <button
                onClick={() => bulkUpdate(false)}
                disabled={!selectedIds.length || loading}
                className="px-4 py-2 border border-black rounded-md flex gap-2 items-center text-sm disabled:opacity-50"
              >
                <EyeOff size={16} />
                Hide Selected
              </button>
            )}
        </div>
      </div>

      {/* SELECTED */}
      <div className="text-sm text-gray-500">
        {selectedIds.length} selected
      </div>

      {/* TABLE */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-200 hover:bg-gray-200">
              <TableHead>
                <input
                  type="checkbox"
                  checked={
                    categoryList.length > 0 &&
                    selectedIds.length === categoryList.length
                  }
                  onChange={toggleSelectAll}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Subcategories</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="bg-white">
            {categoryList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-gray-500"
                >
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categoryList.map((category) => (
                <TableRow key={category.id}>
                  {/* CHECKBOX */}
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(category.id)}
                      onChange={() => toggleSelect(category.id)}
                      className="w-4 h-4 accent-black cursor-pointer"
                    />
                  </TableCell>

                  {/* CATEGORY */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={category.image || "/placeholder.png"}
                        alt={category.name}
                        width={50}
                        height={50}
                        className="rounded object-cover"
                      />

                      <div>
                        <p className="font-medium">
                          {category.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {category.slug}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* PARENT */}
                  <TableCell>{category.parent?.name || "-"}</TableCell>

                  {/* PRODUCTS */}
                  <TableCell>{category._count?.products || 0}</TableCell>

                  {/* CHILDREN */}
                  <TableCell>{category._count?.children || 0}</TableCell>

                  {/* STATUS */}
                  <TableCell>
                    <ProductStatusBadge active={category.isActive} />
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-right">
                    <Link
                      href={`/categories/${category.id}`}
                      className="px-3 py-1 text-sm border border-black bg-white rounded inline-flex gap-1 items-center"
                    >
                      <SquarePen size={16} />
                      Edit
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}