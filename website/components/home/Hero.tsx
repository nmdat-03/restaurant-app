"use client";

import Image from "next/image";
import CustomButton from "../common/CustomButton";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative overflow-hidden w-full py-16 bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900 md:min-h-[calc(100vh-64px)] flex items-center">

            {/* Background glow */}
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />

            <div className="container relative z-10 mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center px-4">

                {/* Text */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mx-auto space-y-6 max-w-xl"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-4xl md:text-6xl text-white font-bold leading-tight"
                    >
                        Welcome to my restaurant
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-lg text-gray-300"
                    >
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <Link href={"/products"}>
                            <CustomButton className="px-6 py-3 bg-white text-black font-medium rounded-full hover:scale-105 transition-transform">
                                Order now
                            </CustomButton>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="flex justify-center"
                >
                    <Image
                        src="/images/hero.jpeg"
                        alt="Hero"
                        width={500}
                        height={500}
                        className="w-full rounded-2xl max-w-xs md:max-w-md object-contain shadow-2xl border border-white/10"
                    />
                </motion.div>

            </div>
        </section>
    );
}