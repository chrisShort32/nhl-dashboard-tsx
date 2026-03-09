type Column = {
    label: string
    key: string
    format?: (value: any) => string
    className?: string
}

type TableProps<T> = {
    header: string
    data: T[]
    columns: Column[]
    rowKey: (row: T) => string
}

export function DataTable<T>({ header, data, columns, rowKey}: TableProps<T>) {
    return (
        <div>
            <h3>{header}</h3>
            <table className="w-full border-collapse">
                <thead className="bg-black-100">
                    <tr>
                        {columns.map((column) => (
                            <th 
                                key={column.key}
                                className="border border-gray-300 px-4 py-2 text-left font-semibold"
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={rowKey(row)} className="hover:bg-indigo-600">
                            {columns.map((column) => (
                                <td 
                                    key={column.key}
                                    
                                    className={`border border-gray-300 px-4 py-2 ${column.className || ''}`}
                                >
                                    {column.format? column.format((row as Record<string, any>)[column.key]) : String((row as Record<string, any>)[column.key])}
                                </td>
                            ))}
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )
}