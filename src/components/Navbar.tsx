import Button from "./Button"
import { useState } from "react"
import { Link } from "react-router";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        {
            name: "About",
            link: "/"
        },
        {
            name: "Project",
            link: "/project"
        },
        {
            name: "Achivement",
            link: "/achivement"
        },
        {
            name: "Blog",
            link: "/blog"
        },
        {
            name: "Resume",
            link: "/resume"
        },
    ];

    return (
        <>
            <nav className="fixed flex justify-between px-4 md:px-10 lg:px-30 bg-secondary/10 backdrop-blur-xs w-full py-5 z-10">
                <h1 className="text-white text-3xl">Ifnu Umar</h1>
                <ul className="hidden md:flex gap-4">
                    {menuItems.map((item) => (
                        <Link to={item.link} key={item.name}>
                            <Button>
                                {item.name}
                            </Button>
                        </Link>
                    ))}
                </ul>
                <div className="md:hidden" onClick={() => setIsOpen(true)}>
                    <Button>
                        Hamburger
                    </Button>
                </div>
            </nav>
            {isOpen && (
                <div
                    className="fixed inset-0 w-full h-screen bg-white/10 bg-opacity-95 backdrop-blur-sm flex flex-col justify-center items-center z-50 md:hidden"
                    aria-modal="true"
                    role="dialog"
                >
                    <div
                        className="absolute top-5 right-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <Button>
                            Close
                        </Button>
                    </div>
                    <ul className="flex flex-col gap-6 text-center">
                        {menuItems.map((item) => (
                            <li key={item.name} onClick={() => setIsOpen(false)}>
                                <Link to={item.link}>
                                    <Button>
                                        {item.name}
                                    </Button>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    )
}