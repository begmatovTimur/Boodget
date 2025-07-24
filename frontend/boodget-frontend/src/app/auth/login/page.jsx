'use client'

import React, {useState} from 'react';
import {useRouter} from "next/navigation";
import Link from "next/link";
import {Eye, EyeOff} from 'lucide-react';

import {apiRequest} from "@/app/lib/api";


const Page = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();


    const LoginUser = async () => {
        try {
            const userObject = {
                username,
                password,
            }
            await apiRequest("auth/token/", "POST", userObject).then(response => {
                localStorage.setItem("access", response.access);
                localStorage.setItem("refresh", response.refresh);
            })
            await router.push("/")
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div
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
                    className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-md transition"
                    onClick={() => LoginUser()}
                >
                    Login
                </button>

                <p className="text-sm text-center text-gray-400 mt-2">
                    Don’t have an account?{' '}
                    <Link href="/auth/register" className="text-yellow-500 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Page;