import { Link } from "react-router-dom"
import { useState } from "react"
type Column<T> = {
  label: string
  key: string
  accessor?: (row: T) => unknown
  format?: (value: unknown | string) => string
  className?: string
}

type TableProps<T> = {
  header: string
  data: T[]
  columns: Column<T>[]
  rowKey: (row: T) => string
  rowClassName?: (row: T) => string
  link?: string
}

function renderCell<T>(column: Column<T>, row: T): string {
  const raw = column.accessor
    ? column.accessor(row)
    : (row as Record<string, unknown>)[column.key]
  return column.format ? column.format(raw) : String(raw ?? "")
}

export function DataTable<T>({
  header,
  data,
  columns,
  rowKey,
  rowClassName,
  link,
}: TableProps<T>) {
  const [showTable, setShowTable] = useState(true)
  return (
    <div className="mt-4">
      <div className="flex items-center mb-2">
        {link ? (
          <Link to={link}>
            <h2 className="text-lg font-bold hover:underline">{header}</h2>
          </Link>
        ) : (
          <h2 className="text-lg font-bold">{header}</h2>
        )}
        <button
          type="button"
          onClick={() => setShowTable((prev) => !prev)}
          className="hover:underline ml-4 text-xs text-accent"
        >
          {showTable ? "Hide" : "Show"}
        </button>
      </div>

      {showTable && (
        <div className="overflow-x-auto">
          <table className="table-auto">
            <thead>
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
                  className={`hover:bg-indigo-600 ${rowClassName ? rowClassName(row) : ""}`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`border border-gray-300 px-4 py-2 ${column.className || ""}`}
                    >
                      {renderCell(column, row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
