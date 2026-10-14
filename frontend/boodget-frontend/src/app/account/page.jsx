import React from 'react';
import AccountComponent from "@/app/components/AccountComponent";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export const metadata = {
    title: "Account",
    description: "Track and manage your money with Boodget.",
};

const Page = () => {
    return <ProtectedRoute><AccountComponent/></ProtectedRoute>;
};

export default Page;
