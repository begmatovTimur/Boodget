import React from 'react';
import Link from "next/link";

const Navbar = () => {
    return (
        <div>
            <div className={'flex justify-between p-3 bg-black'}>
                <h1 className="text-4xl font-bold text-yellow-400">
                    Boodget
                </h1>


                <div className="flex gap-3">
                    <Link href={'/auth/login'}>
                        <button
                            className="px-6 py-2 border border-yellow-600 text-yellow-700 font-medium rounded-md hover:bg-yellow-50 transition cursor-pointer">
                            Login
                        </button>
                    </Link>

                    <Link href={'/auth/register'}>
                        <button
                            className="px-6 py-2 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 transition cursor-pointer">
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default Navbar;