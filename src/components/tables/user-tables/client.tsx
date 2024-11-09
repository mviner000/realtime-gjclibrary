'use client';

import { useState, useCallback } from 'react';
import { DataTable } from '@/components/StudentAttendanceDataTable';
import { columns } from './columns';
import { PaginatedAttendanceOut, AttendanceOut } from '@/types';
import { DatePicker } from '@/components/ui/date-picker';

interface UserClientProps {
  initialData: PaginatedAttendanceOut;
}

export function UserClient({ initialData }: UserClientProps) {
  const [data, setData] = useState<AttendanceOut[]>(initialData.items);
  const [pagination, setPagination] = useState({
    pageIndex: initialData.page - 1,
    pageSize: initialData.size,
    pageCount: Math.ceil(initialData.total / initialData.size),
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const fetchData = useCallback(async (page: number, search: string, date: Date) => {
    setLoading(true);
    try {
      const target_date = date.toISOString().split('T')[0]; // Gets the selected date in 'YYYY-MM-DD' format

      const res = await fetch(`/api/dashboard/all-visitors/${target_date}?page=${page + 1}&size=${pagination.pageSize}&search=${search}`);
      if (!res.ok) throw new Error('Failed to fetch data');
      const newData: PaginatedAttendanceOut = await res.json();
      setData(newData.items);
      setPagination(prev => ({
        ...prev,
        pageCount: Math.ceil(newData.total / prev.pageSize),
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize]);

  const handlePageChange = useCallback((newPage: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPage }));
    fetchData(newPage, searchTerm, selectedDate);
  }, [fetchData, searchTerm, selectedDate]);

  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    fetchData(0, search, selectedDate);
  }, [fetchData, selectedDate]);

  const handleDateChange = useCallback((date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
      fetchData(0, searchTerm, date);
    }
  }, [fetchData, searchTerm]);

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          className="w-[200px]"
        />
        {/* You can add any other controls here */}
      </div>
      <DataTable
        getLinkProps={(row) => row.school_id.toString()}
        columns={columns}
        data={data}
        searchKey="Name"
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          pageCount: pagination.pageCount,
          onPageChange: handlePageChange,
        }}
        total={initialData.total}
        loading={loading}
        onSearch={handleSearch}
      />
    </div>

  );
}