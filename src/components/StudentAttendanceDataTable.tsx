'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import debounce from 'lodash/debounce';
import Link from 'next/link';
import { Rows } from 'lucide-react';
import { table } from 'console';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchKey: string;
    pagination: {
        pageIndex: number;
        pageSize: number;
        pageCount: number;
        onPageChange: (page: number) => void;
    };
    total: number;
    loading: boolean;
    onSearch: (searchTerm: string) => void;
    getLinkProps: (row: TData) => string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    pagination,
    total,
    loading = false,
    onSearch,
    getLinkProps
}: DataTableProps<TData, TValue>) {
    const [searchTerm, setSearchTerm] = useState('');

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: pagination.pageCount,
    });

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            onSearch(value);
        }, 300),
        [onSearch]
    );

    useEffect(() => {
        debouncedSearch(searchTerm);
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, debouncedSearch]);

    return (
        <div className='space-y-3 mt-2'>
            <Input
                placeholder={`Search ${searchKey}...`}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full md:max-w-sm"
            />
            <ScrollArea className="h-[calc(80vh-220px)] rounded-md border md:h-[calc(80dvh-200px)]">
                <Table className="relative">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : data.length > 0 ? (
                            table.getRowModel().rows.map((row) => (

                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            <Link
                                                href={`/student/${getLinkProps(row.original)}`}
                                                className="block w-full h-full"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </Link>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground space-y-2">
                    <div className="flex-1 text-sm text-muted-foreground">
                        Total of {total} |
                        Page {pagination.pageIndex + 1} of {pagination.pageCount}
                    </div>
                    {/* {table.getFilteredRowModel().rows.length} per page | */}
                    <div>
                        <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">data number {pagination.pageSize * pagination.pageIndex + 1} - {pagination.pageSize * pagination.pageIndex + table.getFilteredRowModel().rows.length}</span>
                        | total data of this page is {Math.min(pagination.pageSize * (pagination.pageIndex + 1), table.getFilteredRowModel().rows.length)}
                    </div>
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => pagination.onPageChange(pagination.pageIndex - 1)}
                        disabled={pagination.pageIndex === 0 || loading}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => pagination.onPageChange(pagination.pageIndex + 1)}
                        disabled={pagination.pageIndex === pagination.pageCount - 1 || loading}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}