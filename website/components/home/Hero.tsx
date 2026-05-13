import Image from "next/image";
import CustomButton from "../common/CustomButton";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative overflow-hidden w-full py-16 bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900 md:min-h-[calc(100vh-64px)] flex items-center">

            {/* Background glow */}
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />

            <div className="container relative z-10 mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center px-4">

                {/* Text */}
                <div className="mx-auto space-y-6 max-w-xl">
                    <h1 className="text-4xl md:text-6xl text-white font-bold leading-tight">
                        Welcome to my restaurant
                    </h1>

                    <p className="text-lg text-gray-300">
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    </p>

                    <Link href={"/products"}>
                        <CustomButton className="px-6 py-3 bg-white text-black font-medium rounded-full">
                            Order now
                        </CustomButton>
                    </Link>
                </div>

                {/* Image */}
                <div className="flex justify-center">
                    <Image
                        src="/images/hero.jpeg"
                        alt="Hero"
                        width={500}
                        height={500}
                        className="w-full rounded-2xl max-w-xs md:max-w-md object-contain shadow-2xl border border-white/10"
                    />
                </div>

            </div>
        </section>
    );
}