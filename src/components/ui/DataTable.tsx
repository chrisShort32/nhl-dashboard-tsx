import { Link } from "react-router-dom";
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
    rowClassName?: (row: T) => string
    link?: string
}

export function DataTable<T>({ header, data, columns, rowKey, rowClassName, link}: TableProps<T>) {
    
    return (
        <div className="mt-4">
            {link ? (
                <Link to={link}><h2 className="text-lg font-bold mb-2 hover:underline">{header}</h2></Link>
            ) : (
                <h2 className="text-lg font-bold mb-2">{header}</h2>
            )}
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
                        <tr
                            key={rowKey(row)}
                            className={`hover:bg-indigo-600 ${rowClassName ? rowClassName(row) : ''}`}
                        >
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
