/**
 * Defines a table header
 */
export interface TableHeader {
  width: number;

  value: string;

  align: string;
}

export interface TableOptions {
  borderStyle?: number;
  compact?: boolean;
  align?: string;
  headerAlign?: string;
}
