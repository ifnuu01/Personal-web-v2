import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router";
import Button from "./Button";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function Footer() {
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
            name: "Achievement",
            link: "/achievement",
            icon: "streamline-pixel:social-rewards-certified-diploma"
        },
        {
            name: "Blog",
            link: "/blog",
            icon: "pixel:newspaper"
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
        <div className="w-full bg-secondary/70 backdrop-blur-xs py-5 px-4 md:px-10 lg:px-30 text-white mt-10 flex flex-wrap justify-between items-center">
            <span>© 2024 Ifnu Umar. All rights reserved.</span>
            <div className="flex flex-wrap gap-4 justify-start mt-4">
                {menuItems.filter(item => auth?.user ? item.name !== "Login" : (item.name !== "Logout" && item.name !== "Dashboard")).map((item) => (
                    <Link to={item.link} key={item.name} onClick={item.name === "Logout" ? handleLogout : undefined}>
                        <Button>
                            <Icon icon={item.icon} className="inline-block" />
                            {item.name}
                        </Button>
                    </Link>
                ))
                }
            </div >
        </div >
    )
}

export default Footer