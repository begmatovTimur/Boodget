'use client'

import {useRouter} from "next/navigation";
import {UserCircle2, LogOut, KeyRound, Pencil} from "lucide-react";
import {useEffect, useState} from "react";
import {apiRequest} from "@/app/lib/api";
import {format} from "date-fns";
import {toast} from "react-toastify";
import Modal from "react-modal";

export default function AccountComponent() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);

    const [passwordResetFormData, setPasswordResetFormData] = useState({
        current_password: "",
        new_password: "",
        confirm_new_password: "",
    });

    const [error, setError] = useState("");


    useEffect(() => {
        getProfileData()
    }, [])

    const getProfileData = () => {
        apiRequest('auth/profile/', "GET").then(res => {
            console.log(res);
            setUserData(res);
        }).catch(err => {
            if (err.status === 400) {
                toast.error("API error");
            } else if (err.status === 401) {
                handleError()
            }
        })
    }

    const editProfileData = (data) => {
        apiRequest('auth/profile/', "PATCH", data).then(res => {
            getProfileData()
            toast.success("Profile Updated Successfully!");
        }).catch(err=>{
            if (err.status === 400) {
                toast.error("API error");
            } else if (err.status === 401) {
                handleError()
            }
        })
    }

    const [profileFormData, setProfileFormData] = useState(userData);

    const openModal = () => {
        setProfileFormData(userData);
        setIsEditProfileModalOpen(true);
    };

    const closeEditProfileModal = () => setIsEditProfileModalOpen(false);

    const handleChange = (e) => {
        setProfileFormData({...profileFormData, [e.target.name]: e.target.value});
    };

    const handleSave = (e) => {
        e.preventDefault()
        editProfileData(profileFormData);
        closeEditProfileModal();
    };


    const handlePasswordFormChange = (e) => {
        setPasswordResetFormData({...passwordResetFormData, [e.target.name]: e.target.value});
        setError("");
    };

    const closeResetPasswordModal = () => {
        setIsResetPasswordModalOpen(false)
        setPasswordResetFormData({current_password: "", new_password: "", confirm_new_password: ""});
    };


    const handleResetPassword = () => {
        if (passwordResetFormData.new_password !== passwordResetFormData.confirm_new_password) {
            toast.error("New passwords do not match!");
            return;
        }
        console.log(passwordResetFormData)
        apiRequest('auth/reset-password/', "PATCH", passwordResetFormData).then(res => {
            toast.success("Password updated Successfully!");
            closeResetPasswordModal()
            getProfileData()
        }).catch(err => {
            console.log(err)
            if (err.status === 400) {
                toast.error("Old password is incorrect!");
            } else if (err.status === 401) {
                handleError()
            }
        })
    };

    const handleError = () => {
        toast.error("Unauthorized");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.setItem("status", "authFail");
        router.push("/")
        window.dispatchEvent(new Event("statusChanged"));
    }

    const handleLogout = () => {
        toast.success("Successfully logged out!");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.setItem("status", "authFail");
        router.push("/")
        window.dispatchEvent(new Event("statusChanged"));
    }

    if (!userData) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 pt-28 flex justify-center">
            <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">

                {/* Header */}
                <div className="flex items-center gap-6 bg-gradient-to-r from-yellow-400/20 to-yellow-500/10 p-8">
                    <UserCircle2 className="w-24 h-24 text-yellow-500 flex-shrink-0"/>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{userData.username}</h2>
                        <p className="mt-1 text-gray-600">
                            Balance: <span className="font-semibold text-yellow-600">${userData.balance}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Joined {format(new Date(userData.created_at), "MMMM d, yyyy")}
                        </p>
                    </div>
                </div>

                {/* User info */}
                <div className="px-8 py-6 space-y-5">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">First Name</p>
                        <p className="text-lg font-medium text-gray-900">{userData.first_name}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Last Name</p>
                        <p className="text-lg font-medium text-gray-900">{userData.last_name}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Username</p>
                        <p className="text-lg font-medium text-gray-900">{userData.username}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-100 px-8 py-6 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => openModal()}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-yellow-500 text-black font-medium shadow-sm hover:bg-yellow-600 transition cursor-pointer"
                    >
                        <Pencil className="w-5 h-5"/> Edit Profile
                    </button>
                    <button
                        onClick={() => setIsResetPasswordModalOpen(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition cursor-pointer"
                    >
                        <KeyRound className="w-5 h-5"/> Reset Password
                    </button>
                    <button
                        onClick={() => handleLogout()}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-red-500 text-white font-medium shadow-sm hover:bg-red-600 transition cursor-pointer"
                    >
                        <LogOut className="w-5 h-5"/> Logout
                    </button>
                </div>
            </div>

            {/* Reusable modal styling */}
            <Modal
                isOpen={isEditProfileModalOpen}
                onRequestClose={closeEditProfileModal}
                contentLabel="Edit Profile"
                className="relative bg-white rounded-2xl p-8 w-[420px] mx-auto mt-24 shadow-xl outline-none transform transition-all duration-300"
                overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-start z-50 transition-opacity"
            >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center tracking-tight">
                    Edit Profile
                </h2>

                <form onSubmit={handleSave} className="space-y-6">
                    {["first_name", "last_name", "username"].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                                {field.replace("_", " ")}
                            </label>
                            <input
                                type="text"
                                name={field}
                                value={profileFormData?.[field] || ""}
                                onChange={handleChange}
                                placeholder={`Enter ${field.replace("_", " ")}`}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition shadow-sm"
                                required
                            />
                        </div>
                    ))}

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={closeEditProfileModal}
                            className="px-5 py-2 rounded-lg border bg-red-500 text-white hover:bg-white hover:text-red-500 transition font-medium cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg border bg-indigo-600 text-white font-semibold hover:text-indigo-600 hover:bg-white transition shadow-sm cursor-pointer"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </Modal>

            {/* RESET PASSWORD MODAL */}
            <Modal
                isOpen={isResetPasswordModalOpen}
                onRequestClose={closeResetPasswordModal}
                contentLabel="Reset Password"
                className="relative bg-white rounded-2xl p-8 w-[420px] mx-auto mt-24 shadow-xl outline-none transform transition-all duration-300"
                overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-start z-50 transition-opacity"
            >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center tracking-tight">
                    Reset Password
                </h2>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleResetPassword();
                    }}
                    className="space-y-5"
                >
                    {[
                        {name: "current_password", label: "Current Password"},
                        {name: "new_password", label: "New Password"},
                        {name: "confirm_new_password", label: "Confirm New Password"},
                    ].map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                {field.label}
                            </label>
                            <input
                                type="password"
                                name={field.name}
                                value={passwordResetFormData?.[field.name]}
                                onChange={handlePasswordFormChange}
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition shadow-sm"
                                required
                            />
                        </div>
                    ))}

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={closeResetPasswordModal}
                            className="px-5 py-2 rounded-lg border bg-red-500 text-white hover:bg-white hover:text-red-500 transition font-medium cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg border bg-indigo-600 text-white font-semibold hover:text-indigo-600 hover:bg-white transition shadow-sm cursor-pointer"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </Modal>


        </div>

    );
}
