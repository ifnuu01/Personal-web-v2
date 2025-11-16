import clsx from "clsx";

interface Column<T = Record<string, unknown>> {
    key: string;
    label: string;
    render?: (value: unknown, row: T) => React.ReactNode;
    width?: string; // Optional width untuk responsiveness
    hideOnMobile?: boolean; // Hide column di mobile
}

interface TableProps<T = Record<string, unknown>> {
    columns: Column<T>[];
    data: T[];
    className?: string;
    loading?: boolean;
}

export default function Table<T extends Record<string, unknown> & { _id?: string | number; id?: string | number }>({
    columns,
    data,
    className,
    loading = false
}: TableProps<T>) {
    if (loading) {
        return (
            <div className={clsx("bg-white/5 backdrop-blur-sm p-8", className)}>
                <div className="flex items-center justify-center">
                    <div className="text-white">Loading...</div>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className={clsx("bg-white/5 backdrop-blur-sm p-8", className)}>
                <div className="flex items-center justify-center">
                    <div className="text-white/60">No data available</div>
                </div>
            </div>
        );
    }

    return (
        <div className={clsx("bg-white/5 backdrop-blur-sm", className)}>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-full">
                    <thead className="bg-white/10">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={clsx(
                                        "text-left p-4 font-bold text-white border-b border-white/10 whitespace-nowrap",
                                        column.width || "min-w-0"
                                    )}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr
                                key={String(row._id || row.id || index)}
                                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={clsx(
                                            "p-4 text-white",
                                            column.width || "min-w-0"
                                        )}
                                    >
                                        {column.render
                                            ? column.render(row[column.key], row)
                                            : String(row[column.key] || '')
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
                {data.map((row, index) => (
                    <div
                        key={String(row._id || row.id || index)}
                        className="border-b border-white/10 last:border-b-0 p-4"
                    >
                        <div className="space-y-3">
                            {columns.map((column) => {
                                // Skip columns that are hidden on mobile
                                if (column.hideOnMobile) return null;

                                const value = column.render
                                    ? column.render(row[column.key], row)
                                    : String(row[column.key] || '');

                                return (
                                    <div key={column.key} className="flex flex-col gap-1">
                                        <span className="text-white/70 text-sm font-medium">
                                            {column.label}
                                        </span>
                                        <div className="text-white">
                                            {value}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}