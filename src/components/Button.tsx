export default function Button({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div
            className={`bg-white/10 px-4 py-2 cursor-pointer w-fit text-white hover:bg-white hover:text-primary transition-all ease-in-out duration-1000 flex gap-4 ${className}`}
        >
            {children}
        </div>
    )
}
