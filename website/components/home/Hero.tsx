"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const images = [
    {
        src: "/images/bun_thit_nuong.jpeg",
        rotate: "-6deg",
        translate: "-translate-y-6",
    },
    {
        src: "/images/banh_mi.jpeg",
        rotate: "-8deg",
        translate: "translate-y-8",
    },
    {
        src: "/images/com_tam.jpeg",
        rotate: "6deg",
        translate: "-translate-y-4",
    },
    {
        src: "/images/pho_bo.jpg",
        rotate: "12deg",
        translate: "translate-y-8",
    },
];

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 min-h-[calc(100vh-64px)] flex items-center py-20">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full" />
            <div className="absolute bottom-0 right-0 w-125 h-125 bg-blue-500/10 blur-3xl rounded-full" />

            <div className="container relative z-10 mx-auto px-4">
                <div className="grid lg:grid-cols-3 gap-10 items-center">
                    {/* Left Images */}
                    <div className="hidden md:flex md:flex-col justify-center gap-3">
                        {images.slice(0, 2).map((img, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ rotateY: 0, scale: 1.03 }}
                                initial={{ opacity: 0, x: -50, rotateY: 0 }}
                                animate={{ opacity: 1, x: 0, rotateY: 18 }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                className={`relative w-full h-60 rounded-3xl overflow-hidden shadow-2xl ${img.translate}`}
                                style={{
                                    rotate: img.rotate,
                                    transformPerspective: 1000,
                                }}
                            >
                                <Image
                                    src={img.src}
                                    alt="Food"
                                    fill
                                    className="object-cover hover:scale-110 transition-transform duration-500"
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Center Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center space-y-8"
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-6xl font-black text-white leading-tight"
                        >
                            Exploring
                            <span className="block bg-linear-to-r from-red-500 via-yellow-300 to-red-500 bg-clip-text text-transparent">
                                Vietnamese
                            </span>
                            Food
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed"
                        >
                            Discover handcrafted dishes made with fresh
                            ingredients and unforgettable flavors crafted by
                            passionate chefs.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <Link href="/products">
                                <button className="px-7 py-3 rounded-full border border-white text-white hover:bg-white/10 transition">
                                    View Menu
                                </button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right Images */}
                    <div className="hidden md:flex md:flex-col justify-center gap-3">
                        {images.slice(2, 4).map((img, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ rotateY: 0, scale: 1.03 }}
                                initial={{ opacity: 0, x: 50, rotateY: 0 }}
                                animate={{ opacity: 1, x: 0, rotateY: -18 }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                className={`relative w-full h-60 rounded-3xl overflow-hidden shadow-2xl ${img.translate}`}
                                style={{
                                    rotate: img.rotate,
                                    transformPerspective: 1000,
                                }}
                            >
                                <Image
                                    src={img.src}
                                    alt="Food"
                                    fill
                                    className="object-cover hover:scale-110 transition-transform duration-500"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Mobile Images */}
                <div className="mt-14 grid grid-cols-2 gap-4 lg:hidden">
                    {images.map((img, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15 }}
                            className="relative h-52 rounded-2xl overflow-hidden border border-white"
                            style={{ rotate: img.rotate }}
                        >
                            <Image
                                src={img.src}
                                alt="Food"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}