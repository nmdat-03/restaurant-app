import Hero from "@/components/home/Hero";
import BannerSlider from "@/components/home/BannerSlider";
import ProductList from "@/components/product/ProductList";
import { getCategories } from "@/server/queries/category";
import { getBestSellingProducts, getNewestProducts } from "@/server/queries/product";
import { ArrowRight } from "lucide-react";
import Link from "next/link";


export default async function HomePage() {
    const bestSellingProducts = await getBestSellingProducts(10)
    const products = await getNewestProducts(10)
    const categories = await getCategories()

    return (
        <div>
            {/* HERO */}
            <Hero />

            {/* BANNER SLIDER */}
            <BannerSlider />

            {/* CATEGORIES */}
            <div className="container py-6">
                <h2 className="text-xl font-semibold mb-4">Menu Categories</h2>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/products/category?${category.slug}`}
                            className="bg-white border rounded-xl p-4 shadow-md hover:shadow-lg transition flex items-center justify-center"
                        >
                            {category.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* BEST SELLING DISHES */}
            <div className="container py-6">
                <h2 className="text-xl font-semibold mb-4">Best Selling Dishes</h2>

                <ProductList products={bestSellingProducts} />
            </div>

            {/* NEWEST PRODUCTS */}
            <div className="container py-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Newest Dishes</h2>

                    <Link
                        href="/products?sort=newest"
                        className="flex items-center gap-1 text-sm hover:underline"
                    >
                        View all <ArrowRight size={16} />
                    </Link>
                </div>
                <ProductList products={products} />
            </div>

        </div>
    );
}