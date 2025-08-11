import {useState, useEffect} from "react";
import {PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid} from "recharts";
import {cn} from "@/app/lib/utils";
import {apiRequest} from "@/app/lib/api";
import {router} from "next/client";
import {useRouter} from "next/navigation";
import LoaderComponent from "@/app/components/LoaderComponent"; // your classnames merging function if any

const RANGE_OPTIONS = ["today", "week", "month"];
const COLORS = ["#00c49f", "#ff8042"];
const FINANCE_COLORS = {
    income: "#00c49f",
    expense: "#ff8042",
};
const STATUS = "userMeta"

export default function ReportDashboardComponent() {
    const [range, setRange] = useState("month");
    const [pieData, setPieData] = useState([]);
    const [selectedType, setSelectedType] = useState("income");
    const [barData, setBarData] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const {router} = useRouter();

    useEffect(() => {
        setIsLoading(true)
        if (!range || !selectedType) return;

        apiRequest(`transactions/dash-report/?range=${range}`, "GET")
            .then((response) => {
                const isSessionInvalid = localStorage.getItem("status") !== STATUS
                    || !localStorage.getItem('access')
                    || !localStorage.getItem('refresh')
                if (isSessionInvalid) {
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                    window.dispatchEvent(new Event("statusChanged"));
                    return;
                }
                setIsLoading(false)
                const data = response;
                let totalIncomeData = 0
                let totalExpenseData = 0

                let incomeChartData = []
                let expenseChartData = []

                data.incomes.forEach((item, index) => {
                    totalIncomeData += parseFloat(item?.amount);
                    incomeChartData.push({"name": item?.source?.name, "uv": item?.amount});
                });
                data.expenses.forEach((item, index) => {
                    console.log(item)
                    totalExpenseData += parseFloat(item?.amount);
                    expenseChartData.push({"name": item?.category_details?.name, "uv": item?.amount});
                });
                console.log(incomeChartData);
                console.log(expenseChartData);
                console.log(selectedType);

                if (selectedType === "income") {
                    setBarData(incomeChartData);
                } else if (selectedType === "expense") {
                    setBarData(expenseChartData);
                }

                setPieData([
                    {name: "Income", value: totalIncomeData || 0},
                    {name: "Expense", value: totalExpenseData || 0},
                ]);

                const key = `${selectedType}_sources`;


                setTotalIncome(totalIncomeData)
                setTotalExpense(totalExpenseData)
            })
            .catch((error) => {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                localStorage.setItem("status", "authFail");
                window.dispatchEvent(new Event("statusChanged"));

                setPieData([]);
                setBarData([]);
            });
    }, [range, selectedType]);

    const formatDateRange = () => {
        const today = new Date();
        if (range === "today") return today.toLocaleDateString();
        if (range === "week") {
            const start = new Date(today);
            start.setDate(start.getDate() - 6);
            return `${start.toLocaleDateString()} - ${today.toLocaleDateString()}`;
        }
        return today.toLocaleString("en-US", {month: "long"});
    };


    return (
        <div className="p-6 bg-[#0d0d0d] min-h-screen text-white">
            <div className="flex gap-4 mb-4">
                {RANGE_OPTIONS.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => setRange(opt)}
                        className={cn(
                            "px-4 py-2 rounded-full border cursor-pointer",
                            range === opt ? "bg-[#FFD700] text-black" : "border-gray-600"
                        )}
                    >
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                ))}
            </div>

            <h1 className="text-2xl mb-6 font-semibold text-white">
                <span className="text-[#FFD700]">{formatDateRange()}</span>:&nbsp;
                <span className="text-white">Net Balance</span>&nbsp;
                <span className={totalIncome - totalExpense >= 0 ? 'text-green-400' : 'text-red-500'}>
                    ${totalIncome - totalExpense}
                </span>
            </h1>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Pie Chart */}
                <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-lg">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={80}
                                innerRadius={40}
                                onClick={(data) => setSelectedType(data.name.toLowerCase())}
                            >
                                {pieData.map((entry, index) => {
                                    const isSelected = selectedType === entry.name.toLowerCase();
                                    return (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={isSelected ? COLORS[index] : '#d1d5db'}
                                            strokeWidth={isSelected ? 2 : 1}
                                            outerRadius={isSelected ? 90 : 80} // small pop effect
                                        />
                                    );
                                })}
                            </Pie>
                            <Tooltip/>
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="flex justify-around mt-4">
                        <div className="text-[#00c49f]">Income: {totalIncome}</div>
                        <div className="text-[#ff8042]">Expense: {totalExpense}</div>
                    </div>

                </div>

                {/* Bar Chart and Source List */}
                <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-lg">
                    <h2 className="text-lg font-semibold mb-4 capitalize text-[#FFD700]">
                        {selectedType} Sources
                    </h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart width={600} height={300} data={barData}>
                            <XAxis dataKey="name" stroke="#8884d8"/>
                            <YAxis/>
                            {/*<Tooltip/>*/}
                            {/*<CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>*/}
                            <Bar dataKey="uv" fill="#8884d8" barSize={30}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>


        </div>
    );
}
