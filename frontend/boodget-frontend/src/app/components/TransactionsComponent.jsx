'use client'
import React, {useEffect, useState} from "react";
import {Plus, CalendarDays, Filter, ArrowDown, ArrowUp, Edit, Trash2, Car, XCircle, X} from "lucide-react";
import {apiRequest} from "@/app/lib/api";
import {format} from "date-fns";
import DatePicker from "react-datepicker";
import DynamicLucideIcon from "@/app/lib/DynamicLucideIcon";
import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal";
import {toast} from "react-toastify";
import TransactionForm from "@/app/lib/TransactionForm";
import {useRouter} from "next/navigation";


const TransactionsComponent = () => {
    const [activeTab, setActiveTab] = useState(null);

    const [filteredData, setFilteredData] = useState([]);
    const [filteredClassificationData, setFilteredClassificationData] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSource, setSelectedSource] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemId, setItemId] = useState(null);

    const [showForm, setShowForm] = useState(false);

    const [open, setOpen] = useState(false);
    const [showClassificationComponent, setShowClassificationComponent] = useState(false);

    const [editingItemForm, setEditingItemForm] = useState(null)

    const router = useRouter()

    useEffect(() => {
        if (activeTab === "income") {
            getIncomeData()
            getIncomeSourceData()

        } else if (activeTab === "expense") {
            getExpenseData()
            getExpenseSourceData()

        }
        const currentTab = localStorage.getItem("transactions_tab")
        if (currentTab === "expense") {
            setActiveTab("expense");
        } else {
            setActiveTab("income");
        }
    }, [activeTab, selectedCategory, selectedSource, selectedDate, sortOrder]);


    const handleError = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.setItem("status", "authFail");
        router.push("/")
        window.dispatchEvent(new Event("statusChanged"));
    }

    const handleClearFilters = () => {
        setSelectedDate(null)
        setSelectedCategory(null)
        setSelectedSource(null)
        setSortOrder(true)
    }

    const getIncomeData = () => {
        const filterData = {}

        if (selectedDate) {
            filterData.date = format(selectedDate, "yyyy-MM-dd"); // backend format
        }
        if (selectedSource) {
            filterData.source = selectedSource.id;
        }

        filterData.order = sortOrder


        apiRequest(`transactions/incomes/filter`, "POST", filterData).then((response) => {
            console.log(response.data);
            setFilteredData(response.data);
        }).catch((error) => {
            toast.error("Server error");
        })
    }

    const getExpenseData = () => {
        const filterData = {}

        if (selectedDate) {
            filterData.date = format(selectedDate, "yyyy-MM-dd"); // backend format
        }
        if (selectedCategory) {
            filterData.category = selectedCategory.id;
        }
        filterData.order = sortOrder
        console.log(filterData)

        apiRequest(`transactions/expenses/filter`, "POST", filterData).then((response) => {
            console.log(response.data);
            setFilteredData(response.data);
        }).catch((error) => {
            toast.error("Server error");
        });
    }

    const getIncomeSourceData = () => {
        apiRequest("transactions/income-sources", "GET").then(res => {
            console.log(res);
            setFilteredClassificationData(res);
        }).catch((error) => {
            toast.error("Server error");
        })
    }

    const getExpenseSourceData = () => {
        apiRequest("transactions/expense-categories", "GET").then(res => {
            console.log(res);
            setFilteredClassificationData(res);
        }).catch((error) => {
            toast.error("Server error");
        })
    }

    const handleSelectClassification = (item) => {
        if (activeTab === "income") {
            setSelectedSource(item);
        } else if (activeTab === "expense") {
            setSelectedCategory(item);
        }
    }

    const handleDelete = (item) => {
        if (activeTab === "expense") {
            apiRequest(`transactions/expenses/${item}/`, "DELETE").then((response) => {
                console.log(response);
                getExpenseData()
                toast.success("Expense has been deleted successfully!");
            }).catch((error) => {
                toast.error("Server error");
            });
        } else if (activeTab === "income") {
            apiRequest(`transactions/incomes/${item}/`, "DELETE").then((response) => {
                getIncomeData()
                toast.success("Income has been deleted successfully!");
            }).catch((error) => {
                toast.error("Server error");
            });
        }
    }

    const openModal = (id) => {
        setItemId(id);
        setDeleteModalOpen(true);
    };

    const addTransaction = () => setShowForm(true);

    const handleTransactionSubmit = async (formData) => {
        if (activeTab === "income") {
            apiRequest(`transactions/incomes/`, "POST", formData).then((response) => {
                toast.success("Income has been added successfully!");
                getIncomeData()
            }).catch((error) => {
                toast.error("Server error");
            })
        } else {
            apiRequest(`transactions/expenses/`, "POST", formData).then((response) => {
                toast.success("Expense has been added successfully!");
                getExpenseData()
            }).catch((error) => {
                toast.error("Server error");
            })
        }
    };

    const handleTransactionEditSubmit = async (formData) => {
        const endpoint =
            activeTab === "income"
                ? `transactions/incomes/${formData.id}/`
                : `transactions/expenses/${formData.id}/`;

        apiRequest(endpoint, "PUT", formData)
            .then((response) => {
                toast.success("Transaction has been updated successfully!");
                activeTab === "income" ? getIncomeData() : getExpenseData();
            })
            .catch((error) => {
                toast.error("Server error");
            });
    };

    const editItem = (item) => {
        setEditingItemForm(item);
        setShowForm(true);
    }

    const closeFormModal = () => {
        setShowForm(false)
        setEditingItemForm({})
    }

    const handleTab = (tab) => {
        setActiveTab(tab)
        localStorage.setItem("transactions_tab", tab);
    }

    const handleCalendarChange = () => {
        setShowClassificationComponent(false)
        setOpen((prev) => !prev)
    }

    const handleClassificationChange = () => {
        setOpen(false)
        setShowClassificationComponent((prev) => !prev)
    };

    return (
        <div className="min-h-screen bg-white p-6">
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

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
                <button
                    className="appearance-none flex items-center gap-1 bg-white text-green-600 border  px-4 py-2 pr-10 rounded-lg shadow-sm hover:bg-green-600 hover:text-white hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition cursor-pointer"
                    onClick={() => addTransaction()}
                >
                    <Plus size={18}/> Add {activeTab}
                </button>
                {showForm && (
                    <TransactionForm
                        activeTab={activeTab}
                        onClose={() => closeFormModal()}
                        onSubmit={editingItemForm ? handleTransactionEditSubmit : handleTransactionSubmit}
                        classification={filteredClassificationData}
                        editingItem={editingItemForm}
                    />
                )}
                <div className="relative inline-block">
                    <button
                        onClick={handleCalendarChange}
                        className="appearance-none flex items-center gap-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 pr-10 rounded-lg shadow-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition cursor-pointer"
                    >
                        <CalendarDays size={18}/>
                        {selectedDate ? format(selectedDate, "dd MMM yyyy") : "Date"}
                    </button>

                    {open && (
                        <div className="absolute z-10 mt-2">
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                inline
                            />
                        </div>
                    )}
                </div>
                <div className="relative inline-block">
                    <button
                        className="appearance-none flex items-center gap-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 pr-10 rounded-lg shadow-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition cursor-pointer"

                        onClick={handleClassificationChange}
                    >
                        <Filter size={18}/>
                        {activeTab === "income" ?
                            <>{selectedSource ? selectedSource.name : "Income"}</>
                            : <>
                                {selectedCategory ? selectedCategory.name : "Expense"}
                            </>
                        }
                    </button>

                    {showClassificationComponent && (
                        <div
                            className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-xl z-50 p-3 max-h-60 overflow-y-auto">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">
                                  Select {activeTab === "income" ? "Source" : "Category"}
                                </span>
                                <button onClick={() => setShowClassificationComponent(false)}>
                                    <X size={16} className="text-gray-600 hover:text-black"/>
                                </button>
                            </div>

                            {filteredClassificationData?.length ? (
                                filteredClassificationData.map((item, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleSelectClassification(item)}
                                        className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm"
                                    >
                                        {item?.name}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No data available.</p>
                            )}
                        </div>
                    )}
                </div>


                {["desc", "asc", "newest", "latest"].map((order) => (
                    <button
                        key={order}
                        onClick={() => setSortOrder(order)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition cursor-pointer ${
                            sortOrder === order
                                ? "bg-indigo-500 text-white shadow-md"
                                : "bg-gray-100 hover:shadow-sm"
                        }`}
                    >
                        {/* Icon logic */}
                        {order === "desc" || order === "newest" ? (
                            <ArrowUp size={16}/>
                        ) : (
                            <ArrowDown size={16}/>
                        )}

                        {/* Label logic */}
                        {order === "desc"
                            ? "Highest"
                            : order === "asc"
                                ? "Lowest"
                                : order === "newest"
                                    ? "Newest"
                                    : "Latest"}
                    </button>
                ))}


                <button
                    className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm border border-red-200 cursor-pointer"
                    onClick={() => handleClearFilters()}
                >
                    <XCircle size={18}/>
                    Clear Filters
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                    <thead className="bg-gray-100 text-left">
                    <tr>
                        <th className="px-4 py-2 border-b">ID</th>
                        <th className="px-4 py-2 border-b">
                            {activeTab === 'income' ? 'Source' : 'Category'}
                        </th>
                        <th className="px-4 py-2 border-b">Amount</th>
                        <th className="px-4 py-2 border-b">Date</th>
                        <th className="px-4 py-2 border-b">Note</th>
                        <th className="px-4 py-2 border-b">Tools</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2 flex items-center gap-2">
                                {activeTab === "income" ? (
                                    <>
                                        {item.source?.icon && (
                                            <DynamicLucideIcon
                                                name={item.source.icon}
                                                className="w-4 h-4 text-gray-600"
                                            />
                                        )}
                                        {item.source?.name}
                                    </>
                                ) : (
                                    <>
                                        {item.category_details?.icon && (
                                            <DynamicLucideIcon
                                                name={item.category_details.icon}
                                                className="w-4 h-4 text-gray-600"
                                            />
                                        )}
                                        {item.category_details?.name}
                                    </>
                                )}
                            </td>
                            <td className="px-4 py-2">${item.amount}</td>
                            <td className="px-4 py-2">{format(new Date(item.created_at), "EEEE • MMMM d, yyyy")}</td>
                            <td className="px-4 py-2">{item.note}</td>
                            <td className="px-4 py-2">
                                <div className="flex gap-2">
                                    <button
                                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                        onClick={() => editItem(item)}
                                    >
                                        <Edit size={18}/>
                                    </button>
                                    <button
                                        onClick={() => openModal(item.id)}
                                        className="text-red-600 hover:text-red-800 cursor-pointer"
                                    >
                                        <Trash2 size={18}/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredData.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center py-4 text-gray-400 italic">
                                No {activeTab} transactions found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <ConfirmDeleteModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleDelete}
                    itemId={itemId}
                />
            </div>
        </div>
    );
};

export default TransactionsComponent;
