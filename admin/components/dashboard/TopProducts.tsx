"use client";

import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  image?: string;
  sold: number;
};

export default function TopProducts({
  products,
}: {
  products: Product[];
}) {
  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Top Products
        </h2>

        <Link
          href="/products"
          className="text-sm text-blue-600 hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {products.map((p, index) => (
          <div
            key={p.id}
            className="flex items-center justify-between"
          >
            {/* LEFT */}
            <div className="flex items-center gap-3">
              {/* Rank */}
              <span className="w-5 text-sm text-gray-500">
                {index + 1}
              </span>

              {/* Image */}
              <div className="w-10 h-10 relative">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-md" />
                )}
              </div>

              {/* Name */}
              <p className="font-medium text-sm line-clamp-1">
                {p.name}
              </p>
            </div>

            {/* RIGHT */}
            <p className="text-sm text-gray-600">
              {p.sold} sold
            </p>
          </div>
        ))}

        {products.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-6">
            No data
          </p>
        )}
      </div>
    </div>
  );
}