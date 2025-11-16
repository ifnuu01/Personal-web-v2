function Textarea({
    label,
    placeholder = "",
    value,
    onChange,
    name,
    id,
    error,
    required = false,
    rows = 3
}: {
    label: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    name?: string;
    id?: string;
    error?: string;
    required?: boolean;
    rows?: number;
}) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-white font-medium">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
                id={id}
                rows={rows}
                className="w-full bg-white/10 outline-none border-none px-4 py-2 text-white placeholder-white/60 focus:bg-white/20 transition-all resize-none"
            />
            {error && <span className="text-red-400 text-sm">{error}</span>}
        </div>
    );
}

export default Textarea;