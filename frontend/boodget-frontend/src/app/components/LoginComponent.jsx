'use client'

import React, {useState} from 'react';
import {useRouter} from "next/navigation";
import Link from "next/link";
import {Eye, EyeOff} from 'lucide-react';

import {apiRequest} from "@/app/lib/api";
import {toast} from "react-toastify";

const status = "userMeta"


const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [buttonLoading,  setButtonLoading] = useState(false);

    const router = useRouter();


    const LoginUser = async (e) => {
        if (e) e.preventDefault();
        if (username && password) {
            const userObject = {
                username,
                password,
            }
            setButtonLoading(true)
            await apiRequest("auth/token/", "POST", userObject).then(response => {
                localStorage.setItem("access", response.access);
                localStorage.setItem("refresh", response.refresh);
                localStorage.setItem("status", status);
                window.dispatchEvent(new Event("statusChanged"));
                router.push("/")
                toast.success("Successfully logged in");
            }).catch(e => {
                    toast.error("Incorrect login details provided.");
                }
            )
            setButtonLoading(false)

        } else {
            toast.error("Username and Password must be filled in.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <form
                onSubmit={LoginUser}
                className="bg-[#111] border border-yellow-500 rounded-2xl p-10 w-full max-w-lg space-y-6 shadow-xl"
            >
                <h2 className="text-3xl font-bold text-yellow-500 text-center mb-4">
                    Welcome Back
                </h2>

                <input
                    type="text"
                    placeholder="Username"
                    className="w-full px-4 py-2 bg-black border border-yellow-500 rounded-md placeholder:text-gray-400"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <div className="relative w-full">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        className="w-full px-4 py-2 bg-black border border-yellow-500 rounded-md placeholder:text-gray-400 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-yellow-500"
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                    </div>
                </div>


                <button
                    type="submit"
                    className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-md transition cursor-pointer flex justify-center items-center"
                >
                    {buttonLoading ? (
                        <svg
                            className="animate-spin h-5 w-5 text-black"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                        </svg>
                    ) : (
                        "Login"
                    )}
                </button>


                <p className="text-sm text-center text-gray-400 mt-2">
                    Don’t have an account? {' '}
                    <Link href="/auth/register" className="text-yellow-500 hover:underline">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default LoginComponent;