import {
  SIZE_START_X,
  SIZE_START_Y,
  SIZE_START_ADD,
  SIZE_COLUMN_OPTION_NN,
  SIZE_COLUMN_OPTION_AI,
  SIZE_COLUMN_OPTION_QU,
  SIZE_COLUMN_MARGIN_RIGHT,
  SIZE_MIN_WIDTH,
} from "../Layout";
import { Store } from "../Store";
import { Table, Column, ColumnWidth } from "../store/Table";
import { Show } from "../store/Canvas";
import { Memo } from "../store/Memo";
import { getCoordinate } from "./RelationshipHelper";

export function nextZIndex(tables: Table[], memos: Memo[]): number {
  let max = 1;
  tables.forEach((table: Table) => {
    if (max < table.ui.zIndex) {
      max = table.ui.zIndex;
    }
  });
  memos.forEach((memo: Memo) => {
    if (max < memo.ui.zIndex) {
      max = memo.ui.zIndex;
    }
  });
  return max + 1;
}

export function nextPoint(
  store: Store,
  tables: Table[],
  memos: Memo[]
): { top: number; left: number } {
  const point = {
    top: SIZE_START_Y + store.canvasState.scrollTop,
    left: SIZE_START_X + store.canvasState.scrollLeft,
  };
  let isPosition = true;
  while (isPosition) {
    isPosition = false;
    for (const table of tables) {
      if (table.ui.top === point.top && table.ui.left === point.left) {
        isPosition = true;
        point.top += SIZE_START_ADD;
        point.left += SIZE_START_ADD;
        break;
      }
    }
    for (const memo of memos) {
      if (memo.ui.top === point.top && memo.ui.left === point.left) {
        isPosition = true;
        point.top += SIZE_START_ADD;
        point.left += SIZE_START_ADD;
        break;
      }
    }
  }
  return point;
}

type ColumnWidthKey =
  | "width"
  | "name"
  | "comment"
  | "dataType"
  | "default"
  | "notNull"
  | "autoIncrement"
  | "unique";
export function getMaxWidthColumn(columns: Column[], show: Show) {
  const columnWidth: ColumnWidth = {
    width: 0,
    name: 0,
    comment: 0,
    dataType: 0,
    default: 0,
    notNull: 0,
    autoIncrement: 0,
    unique: 0,
  };
  columns.forEach((column) => {
    if (columnWidth.name < column.ui.widthName) {
      columnWidth.name = column.ui.widthName;
    }
    if (show.columnComment && columnWidth.comment < column.ui.widthComment) {
      columnWidth.comment = column.ui.widthComment;
    }
    if (show.columnDataType && columnWidth.dataType < column.ui.widthDataType) {
      columnWidth.dataType = column.ui.widthDataType;
    }
    if (show.columnDefault && columnWidth.default < column.ui.widthDefault) {
      columnWidth.default = column.ui.widthDefault;
    }
  });
  if (show.columnNotNull) {
    columnWidth.notNull = SIZE_COLUMN_OPTION_NN;
  }
  if (show.columnAutoIncrement) {
    columnWidth.autoIncrement = SIZE_COLUMN_OPTION_AI;
  }
  if (show.columnUnique) {
    columnWidth.unique = SIZE_COLUMN_OPTION_QU;
  }
  Object.keys(columnWidth)
    .filter((key) => key !== "width")
    .forEach((key) => {
      const k = key as ColumnWidthKey;
      if (columnWidth[k] !== 0) {
        columnWidth.width += columnWidth[k] + SIZE_COLUMN_MARGIN_RIGHT;
      }
    });
  return columnWidth;
}

export function getDefaultWidthColumn(show: Show): number {
  let width = SIZE_MIN_WIDTH + SIZE_COLUMN_MARGIN_RIGHT;
  if (show.columnComment) {
    width += SIZE_MIN_WIDTH + SIZE_COLUMN_MARGIN_RIGHT;
  }
  if (show.columnDataType) {
    width += SIZE_MIN_WIDTH + SIZE_COLUMN_MARGIN_RIGHT;
  }
  if (show.columnDefault) {
    width += SIZE_MIN_WIDTH + SIZE_COLUMN_MARGIN_RIGHT;
  }
  if (show.columnNotNull) {
    width += SIZE_COLUMN_OPTION_NN + SIZE_COLUMN_MARGIN_RIGHT;
  }
  if (show.columnAutoIncrement) {
    width += SIZE_COLUMN_OPTION_AI + SIZE_COLUMN_MARGIN_RIGHT;
  }
  if (show.columnUnique) {
    width += SIZE_COLUMN_OPTION_QU + SIZE_COLUMN_MARGIN_RIGHT;
  }
  return width;
}

export function orderByNameASC(tables: Table[]): Table[] {
  return [...tables].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

export function virtualTable(
  current: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  },
  table: Table
): boolean {
  const { minX, minY, maxX, maxY } = current;
  const coordinate = getCoordinate(table);
  return (
    (minX < coordinate.lt.x &&
      coordinate.lt.x < maxX &&
      minY < coordinate.lt.y &&
      coordinate.lt.y < maxY) ||
    (minX < coordinate.lb.x &&
      coordinate.lb.x < maxX &&
      minY < coordinate.lb.y &&
      coordinate.lb.y < maxY) ||
    (minX < coordinate.rt.x &&
      coordinate.rt.x < maxX &&
      minY < coordinate.rt.y &&
      coordinate.rt.y < maxY) ||
    (minX < coordinate.rb.x &&
      coordinate.rb.x < maxX &&
      minY < coordinate.rb.y &&
      coordinate.rb.y < maxY)
  );
}
