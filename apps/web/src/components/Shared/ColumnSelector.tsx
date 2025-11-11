import React from "react";
import Dropdown from "../Dropdown";
import IconCaretDown from "../Icon/IconCaretDown";

interface ColumnSelectorProps {
    hiddenColumns: string[];
    columns: { accessor: string; title: string }[];
    onToggleColumn: (column: string) => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
    hiddenColumns,
    columns,
    onToggleColumn,
}) => {
    return (
        <div className="dropdown">
            <Dropdown
                placement="bottom-start"
                btnClassName="!flex items-center border font-semibold border-white-light dark:border-[#253b5c] rounded-md px-4 py-2 text-sm dark:bg-[#1b2e4b] dark:text-white-dark"
                button={
                    <>
                        <span className="ltr:mr-1 rtl:ml-1">Columns</span>
                        <IconCaretDown className="w-5 h-5" />
                    </>
                }
            >
                <ul className="!min-w-[140px]">
                    {columns.map((col, i) => {
                        return (
                            <li
                                key={i}
                                className="flex flex-col"
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <div className="flex items-center px-4 py-1">
                                    <label className="cursor-pointer mb-0">
                                        <input
                                            type="checkbox"
                                            checked={
                                                !hiddenColumns.includes(
                                                    col.accessor,
                                                )
                                            }
                                            className="form-checkbox"
                                            defaultValue={col.accessor}
                                            onChange={(event: any) => {
                                                console.log(event.target.value);
                                                onToggleColumn(
                                                    event.target.value,
                                                );
                                            }}
                                        />
                                        <span className="ltr:ml-2 rtl:mr-2">
                                            {col.title}
                                        </span>
                                    </label>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </Dropdown>
        </div>
    );
};

export default ColumnSelector;
