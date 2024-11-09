'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { AttendanceOut } from '@/types';
import header from '@/components/auth/header';

export const columns: ColumnDef<AttendanceOut>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'cropped_avatar_url',
    header: 'AVATAR',
    cell: ({ row }) => {
      const defaultAvatar = '/images/def-avatar.svg';
      const avatarSrc = row.original.cropped_avatar_url || row.original.current_cropped_image || defaultAvatar;
      return (
        <img
          src={avatarSrc}
          alt={avatarSrc === defaultAvatar ? 'Default Avatar' : 'Avatar'}
          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
        />
      );
    }
  },
  {
    accessorKey: 'full_name',
    header: 'NAME'
  },
  {
    accessorKey: 'school_id',
    header: 'SCHOOL ID'
  },
  {
    accessorKey: 'course',
    header: 'COURSE'
  },
  {
    accessorKey: 'classification',
    header: 'CLASSIFICATION'
  },
  {
    accessorKey: 'purpose',
    header: 'PURPOSE'
  },
  {
    accessorKey: 'attendance_count',
    header: 'LOGS FOR TODAY',
    cell: ({ row }) => row.original.attendance_count
  },
  {
    accessorKey: 'time_in_date',
    header: 'TIME IN',
    cell: ({ row }) => {
      const date = new Date(row.original.time_in_date);
      return date.toLocaleString();
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
