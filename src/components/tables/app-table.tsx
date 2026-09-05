import type { ReactNode } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface AppTableColumn<T> {
  id: string
  header: ReactNode
  cell: (row: T) => ReactNode
  className?: string
}

interface AppTableProps<T> {
  columns: AppTableColumn<T>[]
  rows: T[]
  rowKey?: (row: T, index: number) => string
  emptyState?: ReactNode
  className?: string
}

export function AppTable<T>({
  columns,
  rows,
  rowKey,
  emptyState,
  className,
}: AppTableProps<T>) {
  return (
    <div className={cn("overflow-hidden rounded-[var(--radius-lg-token)] border border-app-divider", className)}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className="h-11 bg-app-surface-soft/65 text-right text-xs font-medium tracking-[0.18em] text-app-text-muted"
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((row, index) => (
              <TableRow key={rowKey ? rowKey(row, index) : `${index}`} className="border-app-divider/80">
                {columns.map((column) => (
                  <TableCell key={column.id} className={cn("py-4 text-right align-middle", column.className)}>
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="p-0">
                {emptyState || (
                  <div className="p-6 text-sm text-app-text-secondary">
                    لا توجد بيانات محملة لهذا القسم حتى الآن.
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
