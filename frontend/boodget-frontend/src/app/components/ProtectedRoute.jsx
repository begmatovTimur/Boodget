"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoaderComponent from "@/app/components/LoaderComponent";

const STATUS = "userMeta";

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authenticated =
            localStorage.getItem("status") === STATUS &&
            Boolean(localStorage.getItem("access")) &&
            Boolean(localStorage.getItem("refresh"));

        if (!authenticated) {
            router.replace("/auth/login");
            return;
        }

        setIsAuthenticated(true);
    }, [router]);

    if (!isAuthenticated) {
        return <LoaderComponent />;
    }

    return children;
}
