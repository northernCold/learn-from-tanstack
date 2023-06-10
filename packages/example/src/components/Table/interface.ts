// https://github.com/vueComponent/ant-design-vue/blob/main/components/vc-table/interface.ts
import { CSSProperties, TdHTMLAttributes } from 'vue';

export type Key = number | string;

export type ColumnsType<RecordType = unknown> = readonly ColumnType<RecordType>[];

export interface CellType<RecordType = any> {
  key?: Key;
  class?: string;
  style?: CSSProperties;
  column?: ColumnsType<RecordType>[number];
  colSpan?: number;
  rowSpan?: number;
  hasSubColumns?: boolean;
  colStart?: number;
  colEnd?: number;
}

export interface RenderedCell<RecordType> {
  props?: CellType<RecordType>;
  children?: any;
}

export interface ColumnType<RecordType> {
  align?: "left" | "right" | "center";
  colSpan?: number;
  customCell?: (
    record: RecordType,
    rowIndex?: number,
    column?: ColumnType<RecordType>
  ) => TdHTMLAttributes & { colSpan?: number; rowSpan?: number };
  customHeaderCell?: (record: ColumnsType<RecordType>[number], index?: number, column?: ColumnType<RecordType>) => TdHTMLAttributes & { colSpan?: number; rowSpan?: number };
  customRender?: (opt: { text: any, record: RecordType, index: number, column: ColumnType<RecordType>}) => any | RenderedCell<RecordType>;
  dataIndex: string | string[];
  ellipsis?: boolean;
  fixed?: boolean | string;
  key?: Key;
  maxWidth?: number;
  minWidth?: number;
  title?: string;
  width?: number | string;
}