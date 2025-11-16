import clsx from "clsx";

interface ButtonProps {
    bg?: string;
    color?: string;
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

export default function Button({ bg, color, className, children, onClick, type = "button", disabled = false }: ButtonProps) {
    const Component = type === "submit" ? "button" : "div";

    return (
        <Component
            type={Component === "button" ? type : undefined}
            onClick={!disabled ? onClick : undefined}
            className={clsx(
                bg ?? "bg-white/10",
                "px-4 py-2 cursor-pointer w-fit hover:bg-white hover:text-primary transition-all ease-in-out duration-1000 flex items-center gap-2",
                color ?? "text-white",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
            disabled={disabled}
        >
            {children}
        </Component>
    );
}