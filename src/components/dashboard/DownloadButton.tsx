// components/DownloadButton.tsx
import { env } from '@/env';
import React, { useState } from 'react';
import { DatePicker2 } from './DatePicker2';
import { ComboboxPopoverForDownloadPDF } from './ComboboxPopoverForDownloadPDF';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '../ui/button';
import { Download } from 'lucide-react';

interface Props {
    initialDate: Date;
}

type Status = {
    value: string;
    label: string;
    icon: React.ElementType;
};

const DownloadButton: React.FC<Props> = ({ initialDate }) => {
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(initialDate);
    const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
    const { toast } = useToast();

    const handleClick = () => {
        if (!selectedStatus) {
            toast({
                title: "Status not selected",
                description: "Please select a status (tallied or untallied) before downloading.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        const dateString = date.toLocaleDateString('en-CA');

        let url;
        if (selectedStatus.value === 'tallied') {
            url = `${env.NEXT_PUBLIC_API_URL}/attendanceV2-report-pdf/totalPerDay/${dateString}/`;
        } else if (selectedStatus.value === 'untallied') {
            url = `${env.NEXT_PUBLIC_API_URL}/daily_attendance_unconted/${dateString}/`;
        } else {
            toast({
                title: "Invalid status",
                description: "An invalid status was selected. Please try again.",
                variant: "destructive",
            });
            setLoading(false);
            return;
        }

        // Create a temporary anchor element to download the file
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `attendance_${dateString}_${selectedStatus.value}.pdf`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        // Set a timeout to simulate a delay, assuming the download will complete within 5 seconds
        setTimeout(() => {
            setLoading(false);
            toast({
                title: "Download complete",
                description: `The ${selectedStatus.value} attendance report for ${dateString} has been downloaded.`,
                variant: "emerald",
            });
        }, 5000);
    };

    const handleDateChange = (newDate: Date | null) => {
        if (!newDate) {
            throw new Error("Date cannot be null");
        }
        setDate(newDate);
    };

    const handleStatusChange = (status: Status | null) => {
        setSelectedStatus(status);
    };

    return (
        <div className="flex justify-end flex-col gap-2">
            <ComboboxPopoverForDownloadPDF onStatusChange={handleStatusChange} />
            <DatePicker2 selected={date} onChange={handleDateChange} />
            <Button
                className='hover:bg-emerald-500/50 p-1 bg-stone-400/40 rounded-sm'
                onClick={handleClick}
                disabled={loading || !selectedStatus}
                variant="emerald"
            >

                <span className='flex items-center justify-between gap-1 '>
                    <Download size="14" />
                    {loading ? 'Downloading...' : 'Download PDF'}
                </span>
            </Button>
        </div>
    );
};

export default DownloadButton;