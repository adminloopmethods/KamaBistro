export const renderInput = (
    label: string,
    key: string,
    type: "text" | "number" = "text",
    suffix = "",
    value: string | undefined,
    onChange: (name: string, val: string) => void
) => {
    return (
        <div className="flex flex-col gap-1" key={key}>
            {/* <label className="text-xs font-medium text-gray-700 dark:text-gray-200">{label}</label> */}
            <input
                type={type}
                value={value || ""}
                onChange={(e) => {
                    const val = e.target.value;
                    onChange(key, val);
                }}
                placeholder={label}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
            />
        </div>
    );
};