"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {apiRequest} from "@/app/lib/api";
import {toast} from "react-toastify";
import {
    Wallet2,
    LogIn,
    BarChart,
    LayoutDashboard,
    ScrollText,
    UserCircle2,
    Menu,
    X,
    Calendar,
    CalendarDays, ChartPie, LineChart, Receipt, Banknote, CircleDollarSign
} from "lucide-react";
import {usePathname, useRouter} from "next/navigation";

const Navbar = () => {
    const [userData, setUserData] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const pathname = usePathname();

    const router = useRouter();

    useEffect(() => {
        const handleStatusChange = () => {
            const status = localStorage.getItem('status');
            if (status === "authFail") {
                setUserData(null);
            }
            getUserInfo()
        };

        window.addEventListener("statusChanged", handleStatusChange);

        return () => {
            window.removeEventListener("statusChanged", handleStatusChange);
        };
    }, []);

    useEffect(() => {
        window.addEventListener("transaction_made", getUserInfo);

        return () => {
            window.removeEventListener("transaction_made", getUserInfo);
        };
    }, [])

    useEffect(()=>{
        getUserInfo()
    },[])

    const getUserInfo = () => {
        apiRequest("transactions/user-info/")
            .then((res) => {
                setUserData(res)
                setIsLoading(false)
            })
            .catch((err) => {
                console.log("ERROR HAS BEEN OCCURED")
                setUserData(null);
                setIsLoading(false)
            });
    }

    return (
        <nav className="sticky top-0 bg-[#0f0f0f] px-6 py-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Left: Logo */}
                <button className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
                    <Wallet2 className="text-yellow-400 w-7 h-7"/>
                    <span className="text-yellow-400 text-2xl font-bold tracking-wide">Boodget</span>
                </button>

                {/* Hamburger Icon (Mobile) */}
                <div className="md:hidden">
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
                        {mobileOpen ? <X/> : <Menu/>}
                    </button>
                </div>

                {/* Center: Navigation (Desktop only) */}
                {userData && (
                    <div className="max-w-7xl mx-auto flex justify-between items-center">

                        {/* Buttons */}
                        <div className="hidden md:flex gap-6">
                            <button
                                className={`font-medium flex items-center gap-1 cursor-pointer ${
                                    pathname === "/breakdown"
                                        ? "text-yellow-400"
                                        : "text-white hover:text-yellow-400"
                                }`}
                                onClick={() => router.push("/breakdown")}
                            >
                                <ChartPie className="w-5 h-5"/>
                                Breakdown
                            </button>

                            <button
                                className={`font-medium flex items-center gap-1 cursor-pointer ${
                                    pathname === "/trends"
                                        ? "text-yellow-400"
                                        : "text-white hover:text-yellow-400"
                                }`}
                                onClick={() => router.push("/trends")}
                            >
                                <LineChart className="w-5 h-5"/>
                                Trends
                            </button>

                            <button
                                className={`font-medium flex items-center gap-1 cursor-pointer ${
                                    pathname === "/transactions"
                                        ? "text-yellow-400"
                                        : "text-white hover:text-yellow-400"
                                }`}
                                onClick={() => router.push("/transactions")}
                            >
                                <CircleDollarSign className="w-5 h-5"/>
                                Transactions
                            </button>
                        </div>
                    </div>
                )}

                {/* Right: Auth or User Info */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        {!isLoading && (
                            userData ? (
                                <button
                                    className={
                                        `group flex items-center gap-3 cursor-pointer
                                    ${pathname === "/account"
                                            ? "text-yellow-400"
                                            : "text-white hover:text-yellow-400"}
                                    `}

                                    onClick={() => router.push("/account")}
                                >
                                    <UserCircle2 className="w-6 h-6 group-hover:text-yellow-400 transition-colors"/>
                                    <span className="font-semibold group-hover:text-yellow-400 transition-colors">
                                        {userData.username}
                                    </span>
                                    <span className="font-semibold group-hover:text-yellow-400 transition-colors">
                                        |
                                    </span>
                                    <span className="font-semibold group-hover:text-yellow-400 transition-colors">
                                        ${userData.balance}
                                    </span>
                                </button>
                            ) : (
                                <>
                                    <Link href="/auth/login">
                                        <button
                                            className="px-5 py-2 border border-yellow-500 text-yellow-400 rounded-md hover:bg-yellow-500 hover:text-black transition font-medium cursor-pointer">
                                            Login
                                        </button>
                                    </Link>
                                    <Link href="/auth/register">
                                        <button
                                            className="px-5 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 transition font-semibold cursor-pointer">
                                            Sign Up
                                        </button>
                                    </Link>
                                </>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden mt-4 space-y-4">
                    {userData ? (
                        <>
                            <div className="flex flex-col gap-4 px-4">
                                <button
                                    className="text-white hover:text-yellow-400 font-medium flex items-center gap-2">
                                    <LayoutDashboard className="w-5 h-5"/>
                                    Breakdown
                                </button>
                                <button
                                    className="text-white hover:text-yellow-400 font-medium flex items-center gap-2">
                                    <BarChart className="w-5 h-5"/>
                                    Analytics
                                </button>
                                <button
                                    className="text-white hover:text-yellow-400 font-medium flex items-center gap-2"
                                    onClick={() => router.push("/transactions")}
                                >
                                    <ScrollText className="w-5 h-5"/>
                                    Transactions
                                </button>
                                <button
                                    className="text-white hover:text-yellow-400 font-medium flex items-center gap-1 cursor-pointer">
                                    <CircleDollarSign className="w-5 h-5"/>
                                    Transactions
                                </button>
                                <div className="flex items-center gap-2 pt-2 border-t border-white/10 mt-2">
                                    <UserCircle2 className="text-white w-5 h-5"/>
                                    <span className="text-white font-semibold">{userData.username}</span>
                                    <span className="text-white font-semibold">${userData.balance}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-row px-4 gap-3">
                            <Link href="/auth/login">
                                <button
                                    className="px-4 py-2 border border-yellow-500 text-yellow-400 rounded-md hover:bg-yellow-500 hover:text-black transition font-medium">
                                    Login
                                </button>
                            </Link>
                            <Link href="/auth/register">
                                <button
                                    className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 transition font-semibold">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
