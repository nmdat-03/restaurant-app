"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import {
    Autoplay,
    Pagination,
    EffectCoverflow,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import Link from "next/link";
import Image from "next/image";

export default function BannerSliderClient({
    sliders,
}: {
    sliders: any[];
}) {
    return (
        <div className="container py-8">
            <Swiper
                modules={[
                    Autoplay,
                    Pagination,
                    EffectCoverflow,
                ]}
                effect="coverflow"
                centeredSlides
                slidesPerView="auto"
                loop
                autoplay={{
                    delay: 8000,
                    disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 120,
                    modifier: 2,
                    scale: 0.9,
                    slideShadows: false,
                }}
                className="banner-swiper"
            >
                {sliders.map((item, index) => (
                    <SwiperSlide
                        key={item.id}
                        className="w-[85%]! md:w-[80%]! lg:w-[55%]!"
                    >
                        <div className="relative aspect-video overflow-hidden rounded-2xl">
                            {item.link ? (
                                <Link
                                    href={item.link}
                                    className="block w-full h-full"
                                >
                                    <Image
                                        fill
                                        src={item.image}
                                        alt={item.altText || "banner"}
                                        className="object-contain"
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