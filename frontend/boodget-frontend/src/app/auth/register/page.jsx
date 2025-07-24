'use client'

import React, {useState} from 'react';
import Link from "next/link";
import { Eye, EyeOff } from 'lucide-react';

import {apiRequest} from "@/app/lib/api";

const Page = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);



    const registerUser = async () => {
        try {
            const userObject = {
                first_name: firstName,
                last_name: lastName,
                username,
                password,
                role: 1
            };

            console.log(userObject);
            await apiRequest("/register/", "POST", userObject).then(response => {
                console.log(response);
            })
            console.log(firstName, lastName, username, password);
        } catch (error) {
            console.log("tamooom")
            console.log(error.message);}
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">

            <div
                className="bg-[#111] border border-yellow-500 rounded-2xl p-10 w-full max-w-lg space-y-5 shadow-xl"
            >
                <h2 className="text-3xl font-bold text-yellow-500 text-center mb-4">
                    Create Your Account
                </h2>

                <div className="flex gap-4">
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        className="w-1/2 px-4 py-2 bg-black border border-yellow-500 rounded-md placeholder:text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-1/2 px-4 py-2 bg-black border border-yellow-500 rounded-md placeholder:text-gray-400"
                    />
                </div>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 bg-black border border-yellow-500 rounded-md placeholder:text-gray-400"
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
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </div>
                </div>

                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat Password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="w-full px-4 py-2 bg-black border border-yellow-500 rounded-md placeholder:text-gray-400"
                />

                <button
                    type="submit"
                    className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-md transition"
                    onClick={() => registerUser()}
                >
                    Register
                </button>

                <p className="text-sm text-center text-gray-400 mt-2">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-yellow-500 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Page;