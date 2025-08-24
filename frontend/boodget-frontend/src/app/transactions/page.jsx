import React from 'react';
import TransactionsComponent from "@/app/components/TransactionsComponent";

export const metadata = {
    title: "Transactions",
    description: "Track and manage your money with Boodget.",
};

const Page = () => {
    return (
        <TransactionsComponent/>
    );
};

export default Page;