"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';

interface CourseVisitorCount {
    course: string;
    visitor_count: number;
}

export function VisitorsByCourse() {
    console.log('VisitorsByCourse component rendered');
    const [visitorCounts, setVisitorCounts] = useState<CourseVisitorCount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() - 7))); // Default to 7 days ago
    const [endDate, setEndDate] = useState<Date | null>(new Date());

    const fetchVisitorCounts = useCallback(async () => {
        if (!startDate || !endDate) return;

        setLoading(true);
        setError(null);
        try {
            const formattedStartDate = startDate.toISOString().split('T')[0];
            const formattedEndDate = endDate.toISOString().split('T')[0];
            const response = await fetch(`/api/dashboard/visitors-by-course/${formattedStartDate}/${formattedEndDate}`);
            if (!response.ok) {
                throw new Error('Failed to fetch visitor counts');
            }
            const data = await response.json();
            setVisitorCounts(data);
        } catch (err) {
            setError('Error fetching visitor counts');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        if (startDate && endDate) {
            fetchVisitorCounts();
        }
    }, [fetchVisitorCounts, startDate, endDate]);

    const handleRefresh = () => {
        fetchVisitorCounts();
    };

    const handleStartDateChange = (date: Date | null) => {
        console.log('Selected Start Date:', date);
        setStartDate(date);
        if (date && endDate && date > endDate) {
            setEndDate(date);
        }
    };

    const handleEndDateChange = (date: Date | null) => {
        console.log('Selected End Date:', date);
        setEndDate(date);
        if (date && startDate && date < startDate) {
            setStartDate(date);
        }
    };

    const totalVisitors = useMemo(() => {
        return visitorCounts.reduce((acc, curr) => acc + curr.visitor_count, 0);
    }, [visitorCounts]);


    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Card className='flex flex-col'>
            <CardHeader className="flex flex-col items-center space-y-3">
                <CardTitle>Visitors by Course</CardTitle>
                <CardDescription className='flex gap-2'>
                    <span className="bg-green-100 text-green-80 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
                        <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                        </svg>
                        Selected:
                    </span>
                    {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
                </CardDescription>
                <div className="flex space-x-2 mt-2">
                    <DatePicker
                        selected={startDate}
                        onChange={handleStartDateChange}
                        className="w-[170px]"
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={handleEndDateChange}
                        className="w-[170px]"
                    />
                    <Button
                        onClick={handleRefresh}
                        disabled={loading || !startDate || !endDate}
                        variant="outline"
                        size="sm"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div>Loading visitor counts...</div>
                ) : (
                    <>
                        <div className="space-y-2">
                            {visitorCounts.map((item) => (
                                <div key={item.course} className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        {item.course === "Uncategorized" ? "Faculty" : item.course}
                                    </span>
                                    <span className="text-sm text-muted-foreground">{item.visitor_count}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center font-semibold">
                                <span>Total:</span>
                                <span>{totalVisitors}</span>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}