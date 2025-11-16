interface InputProps {
    label: string;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    id?: string;
    error?: string;
    required?: boolean;
}

export default function Input({
    label,
    type = "text",
    placeholder = "",
    value,
    onChange,
    name,
    id,
    error,
    required = false
}: InputProps) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-white font-medium">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
                id={id}
                className="w-full bg-white/10 outline-none border-none px-4 py-2 text-white placeholder-white/60 focus:bg-white/20 transition-all"
            />
            {error && <span className="text-red-400 text-sm">{error}</span>}
        </div>
    )
}
