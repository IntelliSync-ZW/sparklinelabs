import React from 'react';
import { ButtonCell, LinkCell, TextCell } from '../cell';
import { SanityTable, TableCell, InlineNode } from 'structured-table';
import "../style.css";

const TableCellContent = React.memo(({ data }: { data: TableCell }) => {
    switch (data.type) {
        case "text":
            return <TextCell data={data} />;
        case "link":
            return <LinkCell data={data} />;
        case "button":
            return <ButtonCell data={data} />;
        default:
            return <></>;
    }
});
TableCellContent.displayName = "TableCellContent";

function getBodyCellTag(cell: TableCell): "td" | "th" {
    return cell.cellType === "header" ? "th" : "td";
}

function isEmptyCell(cell: TableCell): boolean {
    if (!cell) return true;
    if (cell.type === "text") {
        const val = cell.value;
        if (typeof val === "string") return val.trim() === "";
        if (Array.isArray(val)) {
            if (val.length === 0) return true;
            return val.every((node: InlineNode) => node.type === "string" && (!node.data || node.data.trim() === ""));
        }
        return !val;
    }
    if (cell.type === "link") {
        return !cell.text && !cell.href;
    }
    if (cell.type === "button") {
        return !cell.text;
    }
    return false;
}

function trimBoundaryCells(cells: TableCell[]): TableCell[] {
    if (!Array.isArray(cells) || cells.length === 0) return [];
    let start = 0;
    let end = cells.length;

    while (start < end && isEmptyCell(cells[start])) {
        start++;
    }
    while (end > start && isEmptyCell(cells[end - 1])) {
        end--;
    }

    return cells.slice(start, end);
}

// This component is only used here until it's npm package ready,
const TableView = ({
    data: rawData,
    className = 'border'
}: {
    data: SanityTable | string;
    className?: string;
}) => {
    let data: SanityTable | null = null;
    if (typeof rawData === 'string') {
        try {
            data = JSON.parse(rawData);
        } catch {
            data = null;
        }
    } else {
        data = rawData;
    }

    if (!data || !Array.isArray(data.body)) {
        return null;
    }

    const headerCells = data.header && Array.isArray(data.header.cells) ? trimBoundaryCells(data.header.cells) : null;
    const footerCells = data.footer && Array.isArray(data.footer.cells) && data.footer.cells.length > 0 ? trimBoundaryCells(data.footer.cells) : null;

    return (
        <div className={`st-theme-${className}`} >
            <table>
                {
                    headerCells && headerCells.length > 0 &&
                    <thead>
                        <tr>
                            {data.showSerialIndex && <th>#</th>}
                            {
                                headerCells.map((dh, i) => {
                                    return <th key={dh.uid ?? i} colSpan={dh.colSpan ?? 1} rowSpan={dh.rowSpan ?? 1} style={{ textAlign: dh.align || 'left' }} className={dh.class}>
                                        <TableCellContent data={dh} />
                                    </th>
                                })
                            }
                        </tr>
                    </thead>
                }
                <tbody>
                    {
                        data.body.map((row, idx) => {
                            if (!row || !Array.isArray(row.cells)) return null;
                            const trimmedCells = trimBoundaryCells(row.cells);
                            if (trimmedCells.length === 0) return null;
                            return <tr key={row.uid ?? idx}>
                                {data.showSerialIndex && <td>{idx + 1}</td>}
                                {
                                    trimmedCells.map((cell, cIdx) => {
                                        const Tag = getBodyCellTag(cell);
                                        return <Tag key={cell.uid ?? cIdx} colSpan={cell.colSpan ?? 1} rowSpan={cell.rowSpan ?? 1} style={{ textAlign: cell.align || 'left' }} className={cell.class}>
                                            <TableCellContent data={cell} />
                                        </Tag>
                                    })
                                }
                            </tr>
                        })
                    }
                </tbody>
                {
                    footerCells && footerCells.length > 0 &&
                    <tfoot>
                        <tr>
                            {data.showSerialIndex && <th>#</th>}
                            {
                                footerCells.map((df, fIdx) => {
                                    return <th
                                        key={df.uid ?? fIdx}
                                        colSpan={df.colSpan ?? 1}
                                        rowSpan={df.rowSpan ?? 1}
                                        style={{ textAlign: df.align || 'left' }}
                                        className={df.class}
                                    >
                                        <TableCellContent data={df} />
                                    </th>
                                })
                            }
                        </tr>
                    </tfoot>
                }
            </table>
        </div>
    )
}

export default TableView;
