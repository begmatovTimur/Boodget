import React from 'react';
import TransactionsComponent from "@/app/components/TransactionsComponent";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export const metadata = {
    title: "Transactions",
    description: "Track and manage your money with Boodget.",
};

const Page = () => {
    return (
        <ProtectedRoute><TransactionsComponent/></ProtectedRoute>
    );
};

export default Page;
