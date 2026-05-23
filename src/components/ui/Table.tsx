import type { TableColumn } from '@/types';

type TableProps<T extends object> = {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
};

export const Table = <T extends object>({
  columns,
  data,
  emptyMessage = 'No data available',
}: TableProps<T>) => (
  <div className="table-wrapper">
    <table className="table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr className="table--empty">
            <td colSpan={columns.length}>{emptyMessage}</td>
          </tr>
        ) : (
          data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={String(col.key)}>
                  {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
