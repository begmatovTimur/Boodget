import "./globals.css";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "@/app/components/Navbar";
import ModalSetup from "@/app/lib/ModalSetup";


export default function RootLayout({children}) {
    return (
        <html lang="en">
            <body>
            <div id="app-root"> {/* ✅ Add this */}
                <ModalSetup />
                <Navbar />
                {children}
                <ToastContainer position="top-right" />
            </div>
            </body>
        </html>
    )
}