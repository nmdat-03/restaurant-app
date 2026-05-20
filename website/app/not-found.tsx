"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, UtensilsCrossed } from "lucide-react";

export default function NotFound() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 text-white">
            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-30 -left-30 h-80 w-80 rounded-full bg-red-500/20 blur-3xl" />
                <div className="absolute -bottom-30 -right-30 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative z-10 mx-auto max-w-2xl text-center"
            >
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
                >
                    <UtensilsCrossed className="h-12 w-12 text-orange-400" />
                </motion.div>

                {/* 404 */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="mt-8 text-7xl font-black tracking-tight md:text-8xl"
                >
                    <span className="bg-linear-to-r from-red-400 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
                        404
                    </span>
                </motion.h1>

                {/* Title */}
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-6 text-3xl font-bold md:text-4xl"
                >
                    Oops! Page Not Found
                </motion.h2>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-300"
                >
                    The page you’re looking for might have been removed,
                    renamed, or is temporarily unavailable.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-red-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-105"
                    >
                        <Home className="h-4 w-4" />
                        Back Home
                    </Link>

                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/10"
                    >
                        <UtensilsCrossed className="h-4 w-4" />
                        Explore Menu
                    </Link>
                </motion.div>
            </motion.div>
        </main>
    );
}