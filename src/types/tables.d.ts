/**
 * Defines a table header
 */
interface TableHeader {
  width: number;

  value: string;

  align: string;
}

interface TableOptions {
  borderStyle?: number;
  compact?: boolean;
  align?: string;
  headerAlign?: string;
}
