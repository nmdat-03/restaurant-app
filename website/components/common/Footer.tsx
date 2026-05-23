"use client";

import { Mail, PhoneCall } from "lucide-react";
import Link from "next/link";

import instagramIcon from "@/public/icons/instagram.svg"
import facebookIcon from "@/public/icons/facebook.svg"
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white mt-16">
            <div className="w-full p-10 md:px-16 md:py-10 flex flex-col lg:flex-row lg:justify-between gap-8 text-sm">
                {/* Logo */}
                <div className="md:w-96">
                    <h2 className="text-lg font-bold mb-3">MyRestaurant</h2>
                    <p className="text-gray-300">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus perspiciatis deleniti consequuntur.
                    </p>
                </div>

                <div className="flex flex-col gap-8 md:flex-row md:gap-32 md:justify-center">
                    {/* Restaurant */}
                    <div>
                        <h3 className="font-semibold mb-3">Restaurant</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li><Link href="/products">Menu</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold mb-3">Contact</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex gap-1 items-center">
                                <Mail size={14} />
                                Email: myrestaurant@gmail.com
                            </li>
                            <li className="flex gap-1 items-center">
                                <PhoneCall size={14} />
                                Phone: +84 123 456 789
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-semibold mb-3">Follow Us</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-center gap-1">
                                <Image src={facebookIcon} alt="facebook-icons" width={26} height={26} />
                                <Link href="/">Facebook</Link>
                            </li>
                            <li className="flex items-center gap-1">
                                <Image src={instagramIcon} alt="instagram-icons" width={26} height={26} />
                                <Link href="/">Instagram</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t py-4 text-center text-xs text-gray-300">
                © {new Date().getFullYear()} MyRestaurant. All rights reserved.
            </div>
        </footer>
    );
}