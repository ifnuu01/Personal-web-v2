import { Icon } from "@iconify/react";
import Button from "../components/Button";

export default function Public({ children, title, icon }: { children: React.ReactNode, title?: string, icon?: string }) {
    const socialMedia = [
        {
            name: "LinkedIn",
            link: "https://www.linkedin.com/in/ifnu-umar-03859930a/",
            icon: "pixel:linkedin"
        },
        {
            name: "GitHub",
            link: "https://github.com/ifnuu01",
            icon: "pixel:github"
        }
    ]

    return (
        <div
            className="pt-30 px-4 md:px-10 lg:px-30"
        >
            <div className="fixed right-0 top-80 flex flex-col justify-end z-100">
                {socialMedia.map((item) => (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" key={item.name}>
                        <Button className="py-4">
                            <Icon icon={item.icon} className="lg:text-2xl" />
                        </Button>
                    </a>
                ))}
            </div>
            {(title && icon) && (
                <div className="w-full flex justify-center items-center">
                    <h1 className="flex flex-col items-center justify-center bg-white/10 text-white p-4">
                        <Icon icon={icon} className="text-4xl mb-2" />
                        <span className="text-3xl">{title}</span>
                    </h1>
                </div>
            )}
            {children}
        </div >
    )
}
