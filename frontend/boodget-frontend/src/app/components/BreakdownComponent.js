import React, {useState, useEffect} from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import {apiRequest} from "@/app/lib/api";
import {toast} from "react-toastify";

const monthsList = [
    { id: 1, name: "January" },
    { id: 2, name: "February" },
    { id: 3, name: "March" },
    { id: 4, name: "April" },
    { id: 5, name: "May" },
    { id: 6, name: "June" },
    { id: 7, name: "July" },
    { id: 8, name: "August" },
    { id: 9, name: "September" },
    { id: 10, name: "October" },
    { id: 11, name: "November" },
    { id: 12, name: "December" }
];


const yearsList = [
    {id: "2025", name: "2025"},
    {id: "2026", name: "2026"},
    {id: "2027", name: "2027"},
    {id: "2028", name: "2028"},
    {id: "2029", name: "2029"},
    {id: "2030", name: "2030"},
    {id: "2031", name: "2031"},
    {id: "2032", name: "2032"},
    {id: "2033", name: "2033"},
    {id: "2034", name: "2034"},
    {id: "2035", name: "2035"},
    {id: "2036", name: "2036"},
    {id: "2037", name: "2037"},
    {id: "2038", name: "2038"},
    {id: "2039", name: "2039"}
];


const generateRandomData = () => Math.floor(Math.random() * 10000 + 2000);

const BreakdownComponent = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const [xMonth, setXMonth] = useState(currentMonth);
    const [xYear, setXYear] = useState(currentYear);
    const [yMonth, setYMonth] = useState(currentMonth - 1);
    const [yYear, setYYear] = useState(currentYear);

    const [filteredData, setFilteredData] = useState([]);
    const [incomeData, setIncomeData] = useState([]);
    const [expenseData, setExpenseData] = useState([]);
    const [savingsData,  setSavingsData] = useState([]);

    useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        const filterParams = {
            x_month: `${xYear}-${xMonth}`,
            y_month: `${yYear}-${yMonth}`,
        }
        apiRequest("/transactions/breakdown/", "POST", filterParams).then(response => {
            console.log(response.data);
            setFilteredData(response.data);
            setIncomeData([
                {name: monthsList[xMonth-1].name, value: response.data.x_month.income},
                {name: monthsList[yMonth-1].name, value: response.data.y_month.income},
                {name: "Last 3 Avg", value: response.data.avg.income},
            ]);

            setExpenseData([
                {name: monthsList[xMonth-1].name, value: response.data.x_month.expense},
                {name: monthsList[yMonth-1].name, value: response.data.y_month.expense},
                {name: "Last 3 Avg", value: response.data.avg.expense},
            ]);

            setSavingsData([
                {name: monthsList[xMonth-1].name, value: response.data.x_month.income-response.data.x_month.expense},
                {name: monthsList[yMonth-1].name, value: response.data.y_month.income-response.data.y_month.expense},
                {name: "Last 3 Avg", value: response.data.avg.income-response.data.avg.expense},
            ])
        }).catch(error => {
            toast.error("Server error")
        })
    }

    const renderChart = (data) => (
        <ResponsiveContainer width="100%" height={120}>
            <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis type="number" hide/>
                <YAxis dataKey="name" type="category"/>
                <Tooltip/>
                <Bar dataKey="value" radius={[0, 8, 8, 0]}/>
            </BarChart>
        </ResponsiveContainer>
    );

    const handleCompare = () => {
        getData()
    }


    return (
        <div className="p-8 min-h-screen bg-[#0f1115] text-white space-y-12">

            {/* Header + Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <h1 className="text-3xl font-bold text-yellow-400 text-center lg:text-left">
                    Monthly Comparison Dashboard
                </h1>

                <div className="flex flex-wrap items-center gap-4 justify-center">
                    <button
                        onClick={() => handleCompare()}
                        className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                        Compare
                    </button>

                    {/* From */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-gray-400 font-medium">From:</span>
                        <select
                            className="px-3 py-2 rounded-lg bg-[#1c1e25] border border-gray-700 focus:ring-1 focus:ring-yellow-500 transition cursor-pointer"
                            value={xMonth}
                            onChange={(e) => setXMonth(Number(e.target.value))}
                        >
                            {monthsList.map((m) => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                        <select
                            className="px-3 py-2 rounded-lg bg-[#1c1e25] border border-gray-700 focus:ring-1 focus:ring-yellow-500 transition cursor-pointer"
                            value={xYear}
                            onChange={(e) => setXYear(Number(e.target.value))}
                        >
                            {yearsList.map((y) => (
                                <option key={y.id} value={y.id}>{y.name}</option>
                            ))}
                        </select>
                    </div>

                    <span className="text-gray-400 font-medium">to</span>

                    {/* To */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-gray-400 font-medium">Compare with:</span>
                        <select
                            className="px-3 py-2 rounded-lg bg-[#1c1e25] border border-gray-700 focus:ring-1 focus:ring-yellow-500 transition cursor-pointer"
                            value={yMonth}
                            onChange={(e) => setYMonth(Number(e.target.value))}
                        >
                            {monthsList.map((m) => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                        <select
                            className="px-3 py-2 rounded-lg bg-[#1c1e25] border border-gray-700 focus:ring-1 focus:ring-yellow-500 transition cursor-pointer"
                            value={yYear}
                            onChange={(e) => setYYear(Number(e.target.value))}
                        >
                            {yearsList.map((y) => (
                                <option key={y.id} value={y.id}>{y.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {["Income", "Expense", "Savings"].map((type) => {
                    const chartData = type === "Income" ? incomeData : type === "Expense" ? expenseData : savingsData;
                    const barColor = type === "Income" ? "#22c55e" : type === "Expense" ? "#ef4444" : "#3b82f6";
                    const borderColor = type === "Income" ? "border-green-400" : type === "Expense" ? "border-red-400" : "border-blue-400";

                    return (
                        <div key={type} className={`bg-[#1c1e25] rounded-2xl p-6 shadow-lg border-t-4 ${borderColor} transition hover:scale-[1.03]`}>
                            <h2 className="text-lg font-semibold text-gray-300 mb-4">{type}</h2>
                            <div className="bg-[#f9f9f9] p-3 rounded-xl">
                                <ResponsiveContainer width="100%" height={150}>
                                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                        <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" tick={{ fill: '#374151', fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#111827', borderRadius: 8, border: 'none', color: '#f9f9f9' }}
                                            itemStyle={{ color: barColor, fontWeight: 'bold' }}
                                        />
                                        <Bar dataKey="value" fill={barColor} radius={[6, 6, 6, 6]} barSize={18} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    );
                })}
            </div>


            {/* Commentary Section */}
            <div className="space-y-6">
                {[
                    { label: "income", data: incomeData },
                    { label: "expense", data: expenseData },
                    { label: "savings", data: savingsData },
                ].map(({ label, data }) => {
                    const current = data[0]?.value || 0;
                    const compare = data[1]?.value || 0;
                    const average = data[2]?.value || 0;

                    const diffCompare = current - compare;
                    const diffAverage = current - average;

                    const renderChange = (num) => {
                        if (num > 0) return <span className="text-green-400 font-bold">↑ ${num.toLocaleString()}</span>;
                        if (num < 0) return <span className="text-red-400 font-bold">↓ ${Math.abs(num).toLocaleString()}</span>;
                        return <span className="text-gray-500 font-medium">• no change</span>;
                    };

                    return (
                        <div key={label} className="bg-[#1a1c21] rounded-xl p-5 shadow-md hover:shadow-lg transition-all">
                            <p className="text-gray-400 uppercase tracking-wide text-xs font-semibold mb-2">{label} insights</p>
                            <p className="text-white text-sm leading-relaxed">
                                • In <span className="font-medium">{monthsList[xMonth-1].name}</span>: {renderChange(diffCompare)} vs <span className="font-medium">{monthsList[yMonth-1].name}</span>
                            </p>
                            <p className="text-white text-sm leading-relaxed mt-1">
                                • Compared to last 3 months average: {renderChange(diffAverage)}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>



    );
};

export default BreakdownComponent;
