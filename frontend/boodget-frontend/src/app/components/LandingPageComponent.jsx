'use client'

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import Navbar from "@/app/components/Navbar";
import {apiRequest} from "@/app/lib/api";
import WelcomePageComponent from "@/app/components/WelcomePageComponent";
import LoaderComponent from "@/app/components/LoaderComponent";
import ReportDashboardComponent from "@/app/components/ReportDashboardComponent";


const LandingPageComponent = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        apiRequest("transactions/dash-report/?range=month", "GET")
            .then(response => {
                console.log(response);
                setIsLoggedIn(true);
            }).catch(error => {
            if (error?.response?.status === 401) {
                // token invalid or expired
                console.log("Token expired or invalid");
                setIsLoggedIn(false);
                // show welcome page or redirect
            }
        });
    }, [])

    // if (isLoggedIn === false) return <LoaderComponent/>

    return (
        <div className="min-h-screen bg-white">
            <Navbar/>

            {
                isLoggedIn ? <ReportDashboardComponent/> :
                    <WelcomePageComponent/>
            }

        </div>
    );
};

export default LandingPageComponent;