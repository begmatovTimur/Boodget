import React from 'react';
import Link from "next/link";
import Image from "next/image";
import DashboardIcon from "@/app/icons/Manage money-cuate.svg";

const WelcomePageComponent = () => {
    return (
        <main className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-20 gap-12">
            {/* Left Side */}
            <div className="flex-1 space-y-6 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                    Your personal finance dashboard.
                </h1>
                <p className="text-gray-600 text-lg max-w-md mx-auto md:mx-0">
                    Log your spending, view insights, and keep your goals on track.
                </p>
                <div>
                    <Link href={'/auth/login'}>
                        <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-base font-medium transition-all shadow-sm cursor-pointer">
                            Get Started
                        </button>
                    </Link>

                </div>
            </div>

            <div className="flex-1 flex justify-center md:justify-end">
                <Image
                    src={DashboardIcon}
                    alt="Dashboard Illustration"
                    width={500}
                    height={500}
                    className="object-contain"
                    priority
                />
            </div>
        </main>
    );
};

export default WelcomePageComponent;