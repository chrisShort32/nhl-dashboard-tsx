type Column = {
    label: string
    key: string
    format?: (value: any) => string
    className?: string
}

type StatTableProps = {
    data: any[]
    columns: Column[]
}

export function StatTable({ data, columns }: StatTableProps) {
    return (
        
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
                    <tr key={row.game_id} className="hover:bg-indigo-600">
                        {columns.map((column) => (
                            <td 
                                key={column.key}
                                className={`border border-gray-300 px-4 py-2 ${column.className || ''}`}
                            >
                                {row[column.key]}
                            </td>
                        ))}
                    </tr>
                ))}

            </tbody>
        </table>

    )
}