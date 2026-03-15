interface Column<T extends Record<string, string>> {
  key: keyof T;
  title: string;
}

interface DataTableProps<T extends Record<string, string>> {
  columns: Array<Column<T>>;
  rows: T[];
}

export function DataTable<T extends Record<string, string>>({ columns, rows }: DataTableProps<T>) {
  return (
    <table className="w-full border-collapse">
      <thead className="bg-slate-50 dark:bg-slate-900/40">
        <tr>
          {columns.map((column) => (
            <th
              key={String(column.key)}
              className="border-b border-slate-200 px-3 py-3 text-left text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-50"
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30">
            {columns.map((column) => (
              <td
                key={String(column.key)}
                className="border-b border-slate-200 px-3 py-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400"
              >
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
