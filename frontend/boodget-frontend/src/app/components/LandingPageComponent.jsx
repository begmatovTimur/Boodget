'use client'

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import Navbar from "@/app/components/Navbar";
import {apiRequest} from "@/app/lib/api";
import WelcomePageComponent from "@/app/components/WelcomePageComponent";
import LoaderComponent from "@/app/components/LoaderComponent";
import ReportDashboardComponent from "@/app/components/ReportDashboardComponent";

const STATUS = "userMeta"


const LandingPageComponent = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false); // <-- NEW
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem("status") === STATUS)
        const isSessionInvalid = localStorage.getItem("status") !== STATUS
            || !localStorage.getItem('access')
            || !localStorage.getItem('refresh')
        if (isSessionInvalid) {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            setIsLoggedIn(false)
            setIsLoading(true);
        } else {
            setIsLoggedIn(true)
        }

        setHasCheckedAuth(true);

        const handleChange = () => {
            setIsLoggedIn(localStorage.getItem("status") === STATUS);
        };

        window.addEventListener("statusChanged", handleChange);

        return () => window.removeEventListener("statusChanged", handleChange);
    }, []);


    if (!hasCheckedAuth) return <LoaderComponent/>;

    return (
        <div className="h-auto bg-white">
            {
                isLoggedIn
                    ? <ReportDashboardComponent/>
                    : <WelcomePageComponent/>
            }

        </div>
    );
};

export default LandingPageComponent;