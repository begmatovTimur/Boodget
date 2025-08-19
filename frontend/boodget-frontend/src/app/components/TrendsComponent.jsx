'use client'
import React, {useEffect, useState} from "react";
import {ArrowDown, ArrowUp, CalendarDays} from "lucide-react";
import {apiRequest} from "@/app/lib/api";
import {format} from "date-fns";
import {useRouter} from "next/navigation";
import DynamicLucideIcon from "@/app/lib/DynamicLucideIcon";
import {toast} from "react-toastify";

// Static month/year lists (can make dynamic if needed)
const monthsList = [
    {id: "01", name: "January"},
    {id: "02", name: "February"},
    {id: "03", name: "March"},
    {id: "04", name: "April"},
    {id: "05", name: "May"},
    {id: "06", name: "June"},
    {id: "07", name: "July"},
    {id: "08", name: "August"},
    {id: "09", name: "September"},
    {id: "10", name: "October"},
    {id: "11", name: "November"},
    {id: "12", name: "December"},
];

const yearsList = [
    {id: "2023", name: "2023"},
    {id: "2024", name: "2024"},
    {id: "2025", name: "2025"},
];

const TrendsComponent = () => {
    const [activeTab, setActiveTab] = useState(null);
    const [filteredData, setFilteredData] = useState([]);

    const now = new Date();
    const currentMonth = monthsList[now.getMonth()].id
    const currentYear = now.getFullYear();
    const [selectedMonth, setSelectedMonth] = useState(currentMonth); // 1-12
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [sortOrder, setSortOrder] = useState("asc");

    const router = useRouter();

    const handleError = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.setItem("status", "authFail");
        router.push("/");
        window.dispatchEvent(new Event("statusChanged"));
    };

    const handleClearFilters = () => {
        setSelectedMonth(currentMonth);
        setSelectedYear(currentYear);
        setSortOrder("asc");
    };

    useEffect(() => {
        if (activeTab === "income") {
            getIncomeData();
        } else {
            getExpenseData();
        }
        const currentTab = localStorage.getItem("trends_tab")
        if (currentTab === "expense") {
            setActiveTab("expense");
        } else {
            setActiveTab("income");
        }
    }, [activeTab, selectedMonth, selectedYear, sortOrder]);

    const getIncomeData = () => {
        const filterData = {};
        if (selectedMonth && selectedYear) filterData.month = selectedYear + "-" + selectedMonth;
        if (sortOrder) filterData.order = sortOrder;

        // Sorting logic
        filterData.sort_by = sortOrder;

        apiRequest(`/transactions/trends/incomes`, "POST", filterData)
            .then((response) => {
                setFilteredData(response);
                console.log(response);
            })
            .catch((error) => toast.error("Server error"));
    };

    const getExpenseData = () => {
        const filterData = {};
        if (selectedMonth && selectedYear) filterData.month = selectedYear + "-" + selectedMonth;
        if (sortOrder) filterData.order = sortOrder;

        // Sorting logic
        filterData.sort_by = sortOrder;

        apiRequest(`/transactions/trends/expenses`, "POST", filterData)
            .then((response) => {
                console.log(response);
                setFilteredData(response);
            }).catch((er) =>  toast.error("Server error"));
    };

    const handleTab = (tab) => {
        setActiveTab(tab)
        localStorage.setItem("trends_tab", tab);
    }



    return (
        <div className="min-h-screen bg-[#f9fafb] p-6">
            {/* Income / Expense Toggle */}
            <div className="flex gap-4 mb-6 justify-start">
                {["income", "expense"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTab(tab)}
                        className={`px-5 py-2 rounded-2xl font-semibold transition-shadow duration-200 cursor-pointer ${
                            activeTab === tab
                                ? tab === "income"
                                    ? "bg-green-500 text-white shadow-lg"
                                    : "bg-red-500 text-white shadow-lg"
                                : "bg-gray-100 text-gray-600 hover:shadow-md"
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 justify-start items-center">
                {/* Month Select */}
                <div className="relative inline-block w-40">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="appearance-none w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 pr-10 rounded-lg shadow-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition cursor-pointer"
                    >
                        <option value="">Select Month</option>
                        {monthsList.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                    <div
                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </div>
                </div>

                {/* Year Select */}
                <div className="relative inline-block w-32">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="appearance-none w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 pr-10 rounded-lg shadow-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition cursor-pointer"
                    >
                        <option value="">Select Year</option>
                        {yearsList.map((y) => (
                            <option key={y.id} value={y.id}>{y.name}</option>
                        ))}
                    </select>
                    <div
                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </div>
                </div>


                {["desc", "asc"].map((order) => (
                    <button
                        key={order}
                        onClick={() => setSortOrder(order)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition cursor-pointer ${
                            sortOrder === order ? "bg-indigo-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:shadow-sm"
                        }`}
                    >
                        {order === "desc" ? <ArrowUp size={16}/> :
                            <ArrowDown size={16}/>} {order === "desc" ? "Highest" : "Lowest"}
                    </button>
                ))}

                <button
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg border border-red-200 transition cursor-pointer"
                >
                    Clear
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
                            <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="px-4 py-2 border-b">ID</th>
                                <th className="px-4 py-2 border-b">{activeTab === "income" ? "Source" : "Category"}</th>
                                <th className="px-4 py-2 border-b">Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2 flex items-center gap-2">
                                        {item?.icon && <DynamicLucideIcon name={item.icon} className="w-5 h-5 text-gray-400 flex-shrink-0"/>}
                                        <span className="truncate">{activeTab === "income" ? item?.source : item?.category}</span>
                                    </td>
                                    <td className="px-4 py-2 font-medium text-gray-700">${item.total_amount}</td>
                                </tr>
                            ))}
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-gray-400 italic">
                                        No {activeTab} analytics found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                {/*)}*/}

            </div>
        </div>

    );
};

export default TrendsComponent;
