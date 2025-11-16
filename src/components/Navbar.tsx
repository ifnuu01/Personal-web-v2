import { Icon } from "@iconify/react";
import Button from "./Button";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        auth?.logout();
        navigate("/login");
    };

    const menuItems = [
        {
            name: "About",
            link: "/",
            icon: "pixelarticons:user"
        },
        {
            name: "Project",
            link: "/project",
            icon: "pixel:code-solid"
        },
        {
            name: "Achivement",
            link: "/achivement",
            icon: "pixel:trophy"
        },
        {
            name: "Blog",
            link: "/blog",
            icon: "pixel:newspaper"
        },
        {
            name: "Resume",
            link: "/resume",
            icon: "memory:file"
        },
        {
            name: "Login",
            link: "/login",
            icon: "pixelarticons:login"
        },
        {
            name: "Dashboard",
            link: "/dashboard",
            icon: "pixelarticons:dashboard"
        },
        {
            name: "Logout",
            link: "/logout",
            icon: "pixelarticons:logout"
        }
    ];

    return (
        <>
            <nav className="fixed flex justify-between px-4 md:px-10 lg:px-30 bg-secondary/10 backdrop-blur-xs w-full py-5 z-10">
                <Link to="/" className="text-white text-3xl">Ifnu Umar</Link>
                <ul className="hidden md:flex gap-4">
                    {menuItems.filter(item => auth?.user ? item.name !== "Login" : (item.name !== "Logout" && item.name !== "Dashboard")).map((item) => (
                        <Link to={item.link} key={item.name} onClick={item.name === "Logout" ? handleLogout : undefined}>
                            <Button
                                bg={location.pathname === item.link ? "bg-white" : "bg-white/10"}
                                color={location.pathname === item.link ? "text-primary" : "text-white"}
                            >
                                <Icon icon={item.icon} />
                                {item.name}
                            </Button>
                        </Link>
                    ))}
                </ul>
                <div className="md:hidden" onClick={() => setIsOpen(true)}>
                    <Button>
                        <Icon icon="solar:hamburger-menu-broken" />
                    </Button>
                </div>
            </nav>
            {isOpen && (
                <div
                    className="fixed inset-0 w-full h-screen bg-white/10 bg-opacity-95 backdrop-blur-xl flex flex-col justify-center items-center z-50 md:hidden"
                    aria-modal="true"
                    role="dialog"
                >
                    <div
                        className="absolute top-5 right-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <Button
                            bg="bg-red-500/20"
                            color="text-red-400"
                        >
                            <Icon icon="memory:close" />
                        </Button>
                    </div>
                    <ul className="flex flex-col gap-6 text-center">
                        {menuItems.filter(item => auth?.user ? item.name !== "Login" : (item.name !== "Logout" && item.name !== "Dashboard")).map((item) => (
                            <li key={item.name} onClick={() => setIsOpen(false)}>
                                <Link to={item.link} onClick={item.name === "Logout" ? handleLogout : undefined}>
                                    <Button
                                        bg={location.pathname === item.link ? "bg-white" : "bg-white/10"}
                                        color={location.pathname === item.link ? "text-primary" : "text-white"}
                                    >
                                        <Icon icon={item.icon} />
                                        {item.name}
                                    </Button>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}