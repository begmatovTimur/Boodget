import React from 'react';
import BreakdownComponent from "@/app/components/BreakdownComponent";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export const metadata = {
    title: "Breakdown",
    description: "Track and manage your money with Boodget.",
};


const Page = () => {
    return <ProtectedRoute><BreakdownComponent/></ProtectedRoute>
};

export default Page;
