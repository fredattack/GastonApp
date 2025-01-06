import React, {
    useState,useMemo
} from 'react';

import { DataTable, DataTableSortStatus } from 'mantine-datatable';

type Column = {
    accessor: string;
    title: string;
};
function PetsTable({ data, hiddenColumns, pageSize, onPageSizeChange,columns }: { data: Pet[], hiddenColumns:string[], pageSize:number, onPageSizeChange: (size:number) => void,columns: Column[] }) {
    const [page, setPage] = useState(1);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });

    const visibleColumns = columns.filter((col:Column) => !hiddenColumns.includes(col.accessor));

    const sortedData = data /*= useMemo(() => {
        const sorted = [...data].sort((a:Pet, b:Pet) =>
            sortStatus.direction === 'asc' ? a[sortStatus.columnAccessor].localeCompare(b[sortStatus.columnAccessor]) : b[sortStatus.columnAccessor].localeCompare(a[sortStatus.columnAccessor]),
        );
        return sorted.slice((page - 1) * pageSize, page * pageSize);
    }, [data, sortStatus, page, pageSize]);*/

    return (
        //@ts-ignore
        <DataTable
            withBorder
            records={sortedData}
            columns={visibleColumns}
            totalRecords={data.length}
            recordsPerPage={pageSize}
            onRecordsPerPageChange={onPageSizeChange}
            page={page}
            onPageChange={setPage}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
        />
    );
}

export default PetsTable;
