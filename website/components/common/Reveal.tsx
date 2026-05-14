"use client";

import { motion } from "framer-motion";

type RevealProps = {
    children: React.ReactNode;
    className?: string;
};

export default function Reveal({
    children,
    className,
}: RevealProps) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
                once: false,
                amount: 0.1,
            }}
            transition={{
                duration: 0.5,
                ease: "easeOut",
            }}
        >
            {children}
        </motion.div>
    );
}