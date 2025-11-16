import { useLocation } from "react-router";
import { Link } from "react-router";
import { Icon } from "@iconify/react";
import Button from "./Button";
import clsx from "clsx";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const location = useLocation();
    const menuItems = [
        {
            name: "Dashboard",
            link: "/dashboard",
            icon: "streamline-pixel:interface-essential-pie-chart-poll-report-1"
        },
        {
            name: "Category",
            link: "/dashboard/category",
            icon: "material-symbols:category-rounded"
        },
        {
            name: "Tech",
            link: "/dashboard/tech",
            icon: "material-symbols:military-tech-outline-sharp"
        },
        {
            name: "Project",
            link: "/dashboard/project",
            icon: "pixel:code-solid"
        },
        {
            name: "Certificate",
            link: "/dashboard/certificate",
            icon: "pixel:trophy"
        },
        {
            name: "Experience",
            link: "/dashboard/experience",
            icon: "streamline-pixel:business-products-bag"
        },
        {
            name: "Blog",
            link: "/dashboard/blog",
            icon: "pixel:newspaper"
        }
    ];

    return (
        <>
            {/* Sidebar */}
            <div className={clsx(
                "w-60 h-screen bg-secondary/10 backdrop-blur-xs fixed top-0 left-0 pt-22 px-4 flex flex-col gap-4 z-5 transition-transform duration-300",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="self-end" onClick={() => setIsOpen(!isOpen)}>
                    <Button>
                        <Icon icon="material-symbols-light:side-navigation-sharp" />
                    </Button>
                </div>
                {menuItems.map((item) => (
                    <Link to={item.link} key={item.name}>
                        <Button
                            bg={location.pathname === item.link ? "bg-white" : "bg-white/10"}
                            color={location.pathname === item.link ? "text-primary" : "text-white"}
                            className="w-full font-bold"
                        >
                            <Icon icon={item.icon} />
                            {item.name}
                        </Button>
                    </Link>
                ))}
            </div>

            {/* Toggle Button (when sidebar is closed) */}
            <div className={clsx(
                "fixed top-22 left-2 z-50 transition-opacity duration-300",
                isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
                <div onClick={() => setIsOpen(!isOpen)}>
                    <Button>
                        <Icon icon="material-symbols-light:side-navigation-sharp" />
                    </Button>
                </div>
            </div>

            {/* bg cant click */}
            {isOpen && (
                <div
                    className="fixed inset-0 w-full h-screen bg-black/20 backdrop-blur-sm z-0 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}