'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { Label, Pie, PieChart, Cell } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from '@/components/ui/chart';
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";

interface VisitorCount {
    course: string;
    visitor_count: number;
}

const generateColors = (numCourses: number) => {
    const colors = [];
    for (let i = 0; i < numCourses; i++) {
        const hue = (i * 360) / numCourses;
        colors.push(`hsl(${hue}, 85%, 65%)`);
    }
    return colors;
};

export function DailyPieGraph() {
    const [data, setData] = useState<VisitorCount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const fetchData = useCallback(async () => {
        if (!selectedDate) return;

        setLoading(true);
        setError(null);
        try {
            const targetDate = selectedDate.toISOString().split('T')[0];
            const response = await fetch(`/api/dashboard/daily-visitors-by-course/${targetDate}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const fetchedData = await response.json();
            setData(fetchedData);
        } catch (err) {
            setError('Error fetching data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        if (selectedDate) {
            fetchData();
        }
    }, [fetchData, selectedDate]);

    const handleRefresh = () => {
        fetchData();
    };

    const handleDateChange = (date: Date | null) => {
        console.log('Selected Date:', date);
        setSelectedDate(date);
    };

    const totalVisitors = useMemo(() => {
        return data.reduce((acc, curr) => acc + curr.visitor_count, 0);
    }, [data]);

    const colors = useMemo(() => generateColors(data.length), [data]);

    const chartConfig = useMemo(() => {
        const config: ChartConfig = {
            visitor_count: { label: 'Visitors' }
        };
        data.forEach((item, index) => {
            config[item.course] = {
                label: item.course,
                color: colors[index]
            };
        });
        return config;
    }, [data, colors]);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-2 space-y-3">
                <CardTitle>Daily Visitors by Course</CardTitle>
                <CardDescription className='flex gap-2'>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                        <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                        </svg>
                        Selected Date:
                    </span>
                    {selectedDate?.toLocaleDateString()}
                </CardDescription>
                <div className="flex space-x-2 mt-2">
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        className="w-[170px]"
                    />
                    <Button
                        onClick={handleRefresh}
                        disabled={loading || !selectedDate}
                        variant="outline"
                        size="sm"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {loading ? (
                    <div className="flex items-center justify-center h-[360px]">Loading...</div>
                ) : error ? (
                    <div className="flex items-center justify-center h-[360px]">Error: {error}</div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[360px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={data}
                                dataKey="visitor_count"
                                nameKey="course"
                                innerRadius={40}
                                outerRadius={120}
                                strokeWidth={60}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index]} />
                                ))}
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-3xl font-bold"
                                                    >
                                                        {totalVisitors.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground"
                                                    >
                                                        Visitors
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Calculation <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total visitors for the selected date
                </div>
                <div className="mb-4">
                    <p className="font-semibold mb-2">Legend:</p>
                    <ul className="flex flex-wrap gap-1">
                        {data.map((item: VisitorCount, index: number) => (
                            <li key={item.course} className="flex items-center ">
                                <span
                                    className="inline-block w-4 h-4 rounded-full"
                                    style={{ backgroundColor: chartConfig[item.course]?.color }}
                                ></span>
                                <span className='ml-1'>
                                    {item.course === "Uncategorized" ? "Faculty" : item.course}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardFooter>
        </Card>
    );
}