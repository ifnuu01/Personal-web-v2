import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false); // Auto close on mobile
            } else {
                setIsSidebarOpen(true); // Auto open on desktop
            }
        };
        handleResize();

        // window resize
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex min-h-screen">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div
                className={`
                    flex-1 transition-all duration-300 pt-25 px-4
                    ${isSidebarOpen ? 'ml-60' : 'ml-0'}
                `}
            >
                {children}
            </div>
        </div>
    );
}