import { useEffect, useState } from "react";

const TransactionForm = ({ activeTab, onClose, onSubmit, classification = [], editingItem = {} }) => {
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [selectValue, setSelectValue] = useState("");

    useEffect(() => {
        if (editingItem?.id) {
            setAmount(editingItem.amount || "");
            setNote(editingItem.note || "");
            setSelectValue(
                activeTab === "income"
                    ? editingItem.source?.id || ""
                    : editingItem.category_details?.id || editingItem.category || ""
            );
        } else {
            setAmount("");
            setNote("");
            setSelectValue("");
        }
    }, [editingItem?.id, activeTab]);


    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            amount: parseFloat(amount),
            note,
            ...(activeTab === "income"
                ? { source: selectValue }
                : { category: selectValue }),
        };

        // If editingItem exists, include its ID for the PUT
        if (editingItem?.id) data.id = editingItem.id;

        onSubmit(data);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl border border-gray-100">
                {/* Title */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    {editingItem?.id ? "Edit" : "Add"}{" "}
                    <span className={activeTab === "income" ? "text-green-600" : "text-red-500"}>
        {activeTab === "income" ? "Income" : "Expense"}
      </span>
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                    e.preventDefault();
                                }
                            }}
                            placeholder="0.00"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition shadow-sm"
                            required
                        />


                    </div>

                    {/* Source / Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            {activeTab === "income" ? "Source" : "Category"}
                        </label>
                        <select
                            value={selectValue}
                            onChange={(e) => setSelectValue(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition shadow-sm"
                            required
                        >
                            <option value="">
                                Select {activeTab === "income" ? "Source" : "Category"}
                            </option>
                            {classification.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Note</label>
                        <input
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="e.g. Bought coffee ☕"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition shadow-sm"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium hover:from-indigo-600 hover:to-indigo-700 shadow-md transition cursor-pointer"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default TransactionForm;
