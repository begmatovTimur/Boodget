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
        <div className="p-8 space-y-8 text-[#111]">
            <div
                className="text-2xl font-semibold text-center flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                <button
                    onClick={()=>handleCompare()}
                    className="bg-black text-yellow-400 border border-yellow-500 hover:bg-yellow-500 hover:text-black font-semibold px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition duration-200 cursor-pointer"
                >
                    Compare
                </button>

                <div className="flex items-center gap-2">
                    <select
                        className="px-3 py-2 border rounded-lg"
                        value={xMonth}
                        onChange={(e) => setXMonth(Number(e.target.value))}
                    >
                        {monthsList.map((m) => (
                            <option value={m.id} key={m.name}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                    <select
                        className="px-3 py-2 border rounded-lg"
                        value={xYear}
                        onChange={(e) => setXYear(Number(e.target.value))}
                    >
                        {yearsList.map((y) => (
                            <option value={y.id} key={y.id}>
                                {y.name}
                            </option>
                        ))}
                    </select>
                </div>

                with

                <div className="flex items-center gap-2">
                    <select
                        className="px-3 py-2 border rounded-lg"
                        value={yMonth}
                        onChange={(e) => setYMonth(Number(e.target.value))}
                    >
                        {monthsList.map((m) => (
                            <option value={m.id} key={m.name}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                    <select
                        className="px-3 py-2 border rounded-lg"
                        value={yYear}
                        onChange={(e) => setYYear(Number(e.target.value))}
                    >
                        {yearsList.map((y) => (
                            <option value={y.id} key={y.id}>
                                {y.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>


            <div className="flex gap-8 justify-between">
                {/* INCOME SECTION */}
                <div className="flex-1 bg-white shadow-lg rounded-2xl p-4">
                    <div className="mb-2 text-lg font-medium">Income</div>
                    {renderChart(incomeData)}
                </div>

                {/* EXPENSE SECTION */}
                <div className="flex-1 bg-white shadow-lg rounded-2xl p-4">
                    <div className="mb-2 text-lg font-medium">Expense</div>
                    {renderChart(expenseData)}
                </div>

                {/* SAVINGS SECTION */}
                <div className="flex-1 bg-white shadow-lg rounded-2xl p-4">
                    <div className="mb-2 text-lg font-medium">Savings</div>
                    {renderChart(savingsData)}
                </div>
            </div>

            {/* COMMENT SECTION */}
            <div className="space-y-2 text-sm text-gray-700">
                <h1>
                    * Your income in {monthsList[xMonth].name} has increased by 25% compared
                    to {monthsList[yMonth].name} and decreased by 4% compared to the last 3 months average.
                </h1>
                <h1>
                    * Your expense in {monthsList[xMonth].name} has decreased by 2% compared
                    to {monthsList[yMonth].name} and increased by 5% compared to the last 3 months average.
                </h1>
                <h1>
                    * Your savings in {monthsList[xMonth].name} has increased by 27% compared
                    to {monthsList[yMonth].name} and decreased by 10% compared to the last 3 months average.
                </h1>
            </div>
        </div>
    );
};

export default BreakdownComponent;
