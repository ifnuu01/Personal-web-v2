import clsx from "clsx";

export default function Button({ bg, color, className, children }: { bg?: string; color?: string; className?: string; children: React.ReactNode }) {
    return (
        <div
            className={clsx(
                bg ?? "bg-white/10",
                "px-4 py-2 cursor-pointer w-fit hover:bg-white hover:text-primary transition-all ease-in-out duration-1000 flex items-center gap-2",
                color ?? "text-white",
                className
            )}
        >
            {children}
        </div>
    );
}