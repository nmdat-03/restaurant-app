"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { ChevronLeft, ExternalLink, Heart, Minus, Plus } from "lucide-react";
import CustomButton from "@/components/common/CustomButton";
import { formatPrice } from "@/lib/format";
import clsx from "clsx";

export default function DishDetailClient({ product }: any) {
    const imgRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);

    const increase = () => setQuantity((prev) => prev + 1);
    const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : prev));

    const primaryImage =
        product.images.find((img: any) => img.isPrimary)?.url ||
        product.images[0]?.url;

    const goToProducts = (query: Record<string, string>) => {
        const params = new URLSearchParams(query);
        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between">
                {/* Back button */}
                <CustomButton
                    onClick={() => router.back()}
                    className="text-sm px-4 py-2 rounded-full shadow-md bg-white flex items-center"
                >
                    <ChevronLeft size={14} />
                    Back
                </CustomButton>
                <div className="flex gap-3">
                    <CustomButton className="flex gap-1 px-4 py-2 items-center justify-center text-sm rounded-full shadow-md bg-white">
                        <Heart size={14} className="text-red-500" />
                        Love
                    </CustomButton>
                    <CustomButton className="flex gap-1 px-4 py-2 items-center justify-center text-sm rounded-full shadow-md bg-white">
                        <ExternalLink size={14} />
                        Share
                    </CustomButton>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 space-y-6">

                {/* Top Navigation */}
                <div className="space-y-2">
                    {/* Breadcrumb */}
                    <div className="text-sm text-gray-500">
                        <span
                            className="hover:text-black cursor-pointer"
                            onClick={() => router.push("/products")}
                        >
                            Products
                        </span>

                        {" > "}

                        {product.category?.name && (
                            <>
                                <span
                                    className="hover:text-black cursor-pointer"
                                    onClick={() =>
                                        goToProducts({ category: product.category.slug })
                                    }
                                >
                                    {product.category.name}
                                </span>

                                {" > "}
                            </>
                        )}

                        <span className="text-gray-800 font-medium">
                            {product.name}
                        </span>
                    </div>
                </div>

                {/* Main content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <ProductGallery ref={imgRef} images={product.images} />

                    <div className="space-y-4 md:space-y-5">
                        {/* Product name */}
                        <h1 className="text-xl md:text-2xl font-medium">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <p className="text-xl md:text-2xl font-semibold text-black">
                            {formatPrice(product.price)}
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={decrease}
                                disabled={quantity === 1}
                                className={clsx(
                                    "w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md",
                                    (quantity === 1)
                                        ? "opacity-30 cursor-not-allowed"
                                        : "hover:bg-gray-200"
                                )}
                            >
                                <Minus size={12} />
                            </button>

                            <span className="w-10 h-8 flex items-center justify-center bg-gray-200 rounded-md">
                                {quantity}
                            </span>

                            <button
                                onClick={increase}
                                className="w-8 h-8 bg-gray-100 flex items-center justify-center rounded-md"
                            >
                                <Plus size={12} />
                            </button>
                        </div>

                        {/* Add to cart */}
                        <AddToCartButton
                            variant="page"
                            imgRef={imgRef}
                            product={{
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: primaryImage,
                            }}
                            quantity={quantity}
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="mt-10 border-t border-gray-300 pt-6">
                    <h2 className="text-lg md:text-xl font-semibold mb-3">
                        Description
                    </h2>

                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                        {product.description || "No description available."}
                    </p>
                </div>
            </div>
        </div>

    );
}