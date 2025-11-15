import { Icon } from "@iconify/react";
import Button from "../components/Button";

export default function Public({ children }: { children: React.ReactNode }) {
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
            className="pt-40 px-4 md:px-10 lg:px-30"
        >
            <div className="fixed right-0 top-80 flex flex-col justify-end">
                {socialMedia.map((item) => (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" key={item.name}>
                        <Button className="py-4">
                            <Icon icon={item.icon} className="lg:text-2xl" />
                        </Button>
                    </a>
                ))}
            </div>
            {children}
        </div >
    )
}
