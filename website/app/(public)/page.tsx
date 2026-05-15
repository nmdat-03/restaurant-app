import Hero from "@/components/home/Hero";
import BannerSlider from "@/components/home/BannerSlider";
import ProductList from "@/components/product/ProductList";
import { getCategories } from "@/server/queries/category";
import {
    getBestSellingProducts,
    getNewestProducts,
} from "@/server/queries/product";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/common/Reveal";

export default async function HomePage() {
    const bestSellingProducts = await getBestSellingProducts(10);
    const products = await getNewestProducts(10);
    const categories = await getCategories();

    return (
        <div className="overflow-hidden">
            {/* HERO */}
            <Hero />

            {/* BANNER SLIDER */}
            <Reveal>
                <section className="py-12">
                    <BannerSlider />
                </section>
            </Reveal>

            {/* CATEGORIES */}
            <Reveal>
                <section className="container py-16 md:py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                            Menu Categories
                        </h2>

                        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                            Explore handcrafted dishes made with premium
                            ingredients and unforgettable flavors.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/products/category?${category.slug}`}
                                className="bg-white border rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center font-medium"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </section>
            </Reveal>

            {/* BEST SELLING DISHES */}
            <Reveal>
                <section className="container py-16 md:py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                            Best Selling Dishes
                        </h2>

                        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                            Our most loved dishes chosen by food lovers every
                            day.
                        </p>
                    </div>

                    <ProductList products={bestSellingProducts} />

                    <div className="mt-10 flex justify-center">
                        <Link
                            href="/products?sort=best-selling"
                            className="inline-flex items-center gap-2 border border-black rounded-full px-3 py-1 text-sm font-semibold hover:gap-3 transition-all"
                        >
                            View all dishes <ArrowRight size={16} />
                        </Link>
                    </div>
                </section>
            </Reveal>

            {/* NEWEST PRODUCTS */}
            <Reveal>
                <section>
                    <div className="container py-16 md:py-20">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                                Newest Dishes
                            </h2>

                            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                                Freshly crafted dishes straight from our kitchen.
                            </p>
                        </div>

                        <ProductList products={products} />

                        <div className="mt-10 flex justify-center">
                            <Link
                                href="/products?sort=newest"
                                className="inline-flex items-center gap-2 border border-black rounded-full px-3 py-1 text-sm font-semibold hover:gap-3 transition-all"
                            >
                                View all dishes <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </section>
            </Reveal>

            {/* CTA SECTION */}
            <Reveal>
                <section className="container py-20 md:py-28">
                    <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-10 md:p-16 text-center">
                        {/* Glow Effects */}
                        <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full" />
                        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                                Ready To Enjoy
                                <span className="block bg-linear-to-r from-white via-blue-200 to-indigo-400 bg-clip-text text-transparent">
                                    Your Meal?
                                </span>
                            </h2>

                            <p className="text-gray-300 max-w-2xl mx-auto mt-5 text-lg leading-relaxed">
                                Discover handcrafted dishes made with premium
                                ingredients and unforgettable flavors prepared
                                by passionate chefs.
                            </p>

                            <div className="mt-8">
                                <Link
                                    href="/products"
                                    className="inline-flex items-center px-7 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform"
                                >
                                    Order Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </Reveal>
        </div>
    );
}