import { useState } from "react";
import type { TableProps, User } from "../types";
//?? (nullish coalescing)
const DataTable = ({ data, columns }: TableProps<User>) => {
  const [sortedData, setSortedData] = useState(data);
  const [direction, setDirection] = useState<"asc" | "desc" | null>(null);

  const handleSort = (order: "asc" | "desc", key: keyof User) => {
    const sorted = [...sortedData].sort((a, b) => {
      if ((a[key] ?? "") < (b[key] ?? "")) return direction === "asc" ? -1 : 1;
      if ((a[key] ?? "") > (b[key] ?? "")) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setSortedData(sorted);
    setDirection(order);
  };

  const handleFilter = (val: string, key: keyof User) => {
    const filtered = data.filter((row) => {
      return String(row[key] ?? "")
        .toLocaleLowerCase()
        .includes(val.toLowerCase());
    });
    setSortedData(filtered);
  };

  return (
    <table>
      <thead>
        {columns.map((col) => (
          <>
            <th key={col.key}>
              {col.header}
              {col.sortable && (
                <button
                  onClick={() =>
                    handleSort(direction === "asc" ? "desc" : "asc", col.key)
                  }
                >
                  {direction === "asc" ? "↑" : direction === "desc" ? "↓" : "↕"}
                </button>
              )}
              {col.filterable && (
                <div>
                  <input
                    type="text"
                    onChange={(e) => handleFilter(e.target.value, col.key)}
                  />
                </div>
              )}
            </th>
          </>
        ))}
      </thead>
      <tbody>
        {sortedData.map((row) => {
          const values = Object.values(row);
          return (
            <tr key={row.id}>
              {values.map((value, index) => (
                <td key={index}>
                  {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DataTable;
