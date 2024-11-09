import React, { useState, useEffect, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow, isToday, format } from 'date-fns';
import { DatePicker } from '@/components/ui/date-picker';

interface Visitor {
  id: string;
  school_id: string;
  full_name: string;
  purpose: string;
  course: string;
  time_in_date: string;
  classification: string;
  current_avatar: string | null;
  attendance_count: number | null;
}

export function RecentVisitors() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const targetDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
      const response = await fetch(`/api/dashboard/recent-visitors/${targetDate}`);
      if (!response.ok) {
        throw new Error('Failed to fetch visitors');
      }
      const data = await response.json();

      console.log('Recent visitors:', data);

      setVisitors(data);
    } catch (err) {
      setError('Error fetching recent visitors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  const handleRefresh = () => {
    fetchVisitors();
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    if (isToday(date)) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, "MMM d, yyyy 'at' h:mm a");
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Recent Visitors</h2>
        <div className="flex items-center space-x-2">
          <DatePicker
            onChange={handleDateChange}
            selected={selectedDate}
            className="w-[200px]"
          />
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      {loading ? (
        <div>Loading recent visitors...</div>
      ) : (
        <>

          <div className="flex items-center mb-2 p-1.5 rounded-md">
            <div className="grid grid-cols-4 w-full items-center justify-center">
              <div className='flex col-span-2 gap-1'>
                Full
                <div className='flex flex-col'>
                  Name
                </div>
              </div>
              <div><div className="w-full ml-4 space-y-1 text-center">

                <p className='text-xs'>Number of Logs Today</p>
              </div>
              </div>
              <div>
                <div className="ml-auto text-right">Purpose</div></div>

            </div>
          </div>
          {visitors.map((visitor) => (

            <Link key={visitor.id} href={`/student/${visitor.school_id}`}>
              <div className="flex items-center mb-2 hover:bg-emerald-500/50 p-1.5 rounded-md">
                <div className="grid grid-cols-4 gap-1 w-full items-center justify-center">
                  <div className='flex col-span-2 gap-2'>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={visitor.current_avatar || '/images/def-avatar.svg'} alt={visitor.full_name} />
                      <AvatarFallback>{visitor.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                      <p className="text-sm font-medium leading-none">{visitor.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {visitor.course} • {formatDateTime(visitor.time_in_date)}
                      </p>
                    </div>
                  </div>
                  <div><div className="ml-4 space-y-1 text-center">

                    <p>{visitor.attendance_count !== null ? visitor.attendance_count : "N/A"}</p>
                  </div>
                  </div>
                  <div>
                    <div className="ml-auto font-medium text-right">{visitor.purpose}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}

        </>
      )}
    </div>
  );
}