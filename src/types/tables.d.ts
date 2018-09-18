/**
 * Defines a table header
 */
export interface TableHeader {
  width: number;

  value: string;

  align: string;
}

/**
 * Table options that can be passed to the table generator
 */
export interface TableOptions {
  borderStyle?: number;
  compact?: boolean;
  align?: string;
  headerAlign?: string;
}
