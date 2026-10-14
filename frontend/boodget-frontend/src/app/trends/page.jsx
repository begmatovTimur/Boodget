import React from 'react';
import TrendsComponent from "@/app/components/TrendsComponent";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export const metadata = {
    title: "Trends",
    description: "Track and manage your money with Boodget.",
};

const Page = () => {
    return <ProtectedRoute><TrendsComponent/></ProtectedRoute>;
};

export default Page;
