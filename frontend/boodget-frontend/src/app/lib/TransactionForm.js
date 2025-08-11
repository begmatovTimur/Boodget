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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                    {editingItem?.id ? "Edit" : "Add"} {activeTab === "income" ? "Income" : "Expense"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount"
                        className="w-full border p-2 rounded"
                        required
                    />

                    <select
                        value={selectValue}
                        onChange={(e) => setSelectValue(e.target.value)}
                        className="w-full border p-2 rounded"
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

                    <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Note"
                        className="w-full border p-2 rounded"
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
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
