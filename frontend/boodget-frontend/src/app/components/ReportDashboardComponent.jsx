import {useState, useEffect} from "react";
import {PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid} from "recharts";
import {cn} from "@/app/lib/utils";
import {apiRequest} from "@/app/lib/api";
import {router} from "next/client";
import {useRouter} from "next/navigation";
import LoaderComponent from "@/app/components/LoaderComponent";
import DynamicLucideIcon from "@/app/lib/DynamicLucideIcon";
import {toast} from "react-toastify"; // your classnames merging function if any

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
                console.log(response)
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
                    incomeChartData.push({"name": item?.source?.name, "uv": item?.amount,  "icon": item?.source?.icon});
                });
                data.expenses.forEach((item, index) => {
                    console.log(item)
                    totalExpenseData += parseFloat(item?.amount);
                    expenseChartData.push({"name": item?.category_details?.name, "uv": item?.amount, "icon": item?.category_details?.icon});
                });

                console.log(data.incomes)
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
            .catch((err) => {
                if (err.status === 400) {
                    toast.error("API error");
                } else if (err.status === 401) {
                    handleError()
                }

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

    const handleError = () => {
        toast.error("Unauthorized");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.setItem("status", "authFail");
        router.push("/")
        window.dispatchEvent(new Event("statusChanged"));
    }


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
                {barData.length > 0 && barData ? (
                    <>
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
                                                    fill={isSelected ? COLORS[index] : "#d1d5db"}
                                                    strokeWidth={isSelected ? 2 : 1}
                                                    outerRadius={isSelected ? 90 : 80}
                                                />
                                            );
                                        })}
                                    </Pie>
                                    <Tooltip/>
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="flex justify-around mt-4 text-sm text-gray-300">
                                <div className="flex items-center gap-1">
                                    <span className="text-green-400"> Income:</span> {totalIncome}
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-red-400"> Expense:</span> {totalExpense}
                                </div>
                            </div>

                        </div>

                        {/* Bar Chart */}
                        <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-lg">
                            <h2 className="text-lg font-semibold mb-4 capitalize text-[#FFD700]">
                                {selectedType} Sources
                            </h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart
                                    data={barData}
                                    margin={{ bottom: 40 }} // add space for icons
                                >
                                    <XAxis
                                        dataKey="name"
                                        tick={(props) => {
                                            const { x, y, payload } = props;
                                            const item = barData.find(d => d.name === payload.value);

                                            return (
                                                <g transform={`translate(${x},${y + 20})`}>
                                                    {item?.icon && (
                                                        <DynamicLucideIcon
                                                            name={item.icon}
                                                            className="w-6 h-6 text-gray-500"
                                                        />
                                                    )}
                                                </g>
                                            );
                                        }}
                                    />
                                    <YAxis />
                                    <Bar dataKey="uv" fill="#8884d8" barSize={30} />
                                    <Tooltip
                                        cursor={{ fill: "rgba(0,0,0,0.1)" }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const { name, uv } = payload[0].payload;
                                                return (
                                                    <div className="bg-white shadow-md rounded-lg p-2 border text-sm">
                                                        <p className="text-gray-600">{name}: {uv}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>



                        </div>
                    </>
                ) : (
                    // Unified Empty State
                    <div
                        className="col-span-2 bg-[#1a1a1a] p-10 rounded-2xl shadow-lg flex flex-col items-center justify-center text-gray-400">
                        <div
                            className="w-20 h-20 rounded-full border-2 border-dashed border-gray-600 mb-6 animate-pulse"></div>
                        <p className="text-xl font-medium">No insights yet</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Add some transactions to unlock charts & analytics
                        </p>
                    </div>
                )}
            </div>


        </div>
    );
}
