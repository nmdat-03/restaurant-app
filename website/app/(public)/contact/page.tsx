import CustomButton from "@/components/common/CustomButton";
import { Mail, MapPin, PhoneCall } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* HERO */}
            <section className="bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900 text-white py-20">
                <div className="container text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Contact Us
                    </h1>

                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Have questions about products, orders, or partnerships?
                        We’d love to hear from you.
                    </p>
                </div>
            </section>

            {/* CONTENT */}
            <section className="container py-16 grid lg:grid-cols-2 gap-10 items-start">

                {/* LEFT */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-semibold mb-3">
                            Get in touch
                        </h2>

                        <p className="text-muted-foreground leading-relaxed">
                            Our team is here to help you with product inquiries,
                            order support, shipping information, or anything else
                            related to your shopping experience.
                        </p>
                    </div>

                    <div className="space-y-5">

                        {/* EMAIL */}
                        <div className="flex items-start gap-4 bg-white border rounded-2xl p-5 shadow-sm">
                            <div className="p-3 rounded-xl bg-slate-100">
                                <Mail size={20} />
                            </div>

                            <div>
                                <h3 className="font-semibold mb-1">
                                    Email
                                </h3>

                                <p className="text-muted-foreground text-sm">
                                    myrestaurant@gmail.com
                                </p>
                            </div>
                        </div>

                        {/* PHONE */}
                        <div className="flex items-start gap-4 bg-white border rounded-2xl p-5 shadow-sm">
                            <div className="p-3 rounded-xl bg-slate-100">
                                <PhoneCall size={20} />
                            </div>

                            <div>
                                <h3 className="font-semibold mb-1">
                                    Phone
                                </h3>

                                <p className="text-muted-foreground text-sm">
                                    +84 123 456 789
                                </p>
                            </div>
                        </div>

                        {/* ADDRESS */}
                        <div className="flex items-start gap-4 bg-white border rounded-2xl p-5 shadow-sm">
                            <div className="p-3 rounded-xl bg-slate-100">
                                <MapPin size={20} />
                            </div>

                            <div>
                                <h3 className="font-semibold mb-1">
                                    Address
                                </h3>

                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    123 Nguyen Hue Street, District 1,
                                    Ho Chi Minh City, Vietnam
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FORM */}
                <div className="bg-white border rounded-3xl p-8 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-2">
                            Send a message
                        </h2>

                        <p className="text-muted-foreground text-sm">
                            Fill out the form below and we’ll get back to you as
                            soon as possible.
                        </p>
                    </div>

                    <form className="space-y-5">

                        {/* NAME */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Full Name
                            </label>

                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="your_email@gmail.com"
                                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                            />
                        </div>

                        {/* MESSAGE */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Message
                            </label>

                            <textarea
                                rows={6}
                                placeholder="Write your message here..."
                                className="w-full border rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-slate-300"
                            />
                        </div>

                        {/* BUTTON */}
                        <CustomButton
                            className="w-full bg-slate-900 text-white rounded-xl py-3 font-medium"
                        >
                            Send Message
                        </CustomButton>
                    </form>
                </div>
            </section>
        </div>
    );
}

