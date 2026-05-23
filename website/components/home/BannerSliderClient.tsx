"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";
import Image from "next/image";

export default function BannerSliderClient({
    sliders,
}: {
    sliders: any[];
}) {
    return (
        <div className="container py-6">
            <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 5000 }}
                pagination={{ clickable: true }}
                loop
                className="banner-swiper rounded-lg overflow-hidden"
            >
                {sliders.map((item, index) => (
                    <SwiperSlide key={item.id}>
                        <div className="relative aspect-video w-full">
                            {item.link ? (
                                <Link
                                    href={item.link}
                                    className="block w-full h-full"
                                >
                                    <Image
                                        fill
                                        src={item.image}
                                        alt={item.altText || "banner"}
                                        className="object-contain cursor-pointer"
                                        sizes="100vw"
                                        priority={index === 0}
                                    />
                                </Link>
                            ) : (
                                <Image
                                    fill
                                    src={item.image}
                                    alt={item.altText || "banner"}
                                    className="object-contain"
                                    sizes="100vw"
                                    priority={index === 0}
                                />
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}