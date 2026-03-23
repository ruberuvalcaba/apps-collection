import type { Column } from "./Column";

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
}
