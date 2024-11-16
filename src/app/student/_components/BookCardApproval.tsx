import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useNotifications } from '@/contexts/NotificationsContext';
import { CheckIcon, XIcon } from 'lucide-react';

interface BookCardApprovalProps {
    userId: string;
    approveId: string;
    isBookCardPhotoApproved: "approved" | "disapproved" | "pending";
    onApprovalChange: (newStatus: "approved" | "disapproved" | "pending") => void;
}

const BookCardApproval: React.FC<BookCardApprovalProps> = ({
    userId,
    approveId,
    isBookCardPhotoApproved,
    onApprovalChange
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const { fetchNotifications } = useNotifications();

    const handleApproval = async (newApprovalStatus: "approved" | "disapproved") => {
        setIsProcessing(true);
        try {
            const response = await fetch(`/api/approve-book-cardphoto/${approveId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    is_approved: newApprovalStatus,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update approval status');
            }

            const result = await response.json();
            onApprovalChange(newApprovalStatus);
            toast({
                title: "Success",
                description: result.message,
            });

            await fetchNotifications();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update approval status",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className='space-x-3'>
            {isBookCardPhotoApproved !== "approved" && (
                <Button
                    variant="emerald"
                    className='w-auto'
                    onClick={() => handleApproval("approved")}
                    disabled={isProcessing}
                >
                    <CheckIcon className="h-4 w-4" /> Approve
                </Button>
            )}
            {isBookCardPhotoApproved !== "disapproved" && (
                <Button
                    variant="destructive"
                    onClick={() => handleApproval("disapproved")}
                    disabled={isProcessing}
                >
                    <XIcon className="h-4 w-4" /> Disapprove
                </Button>
            )}
        </div>
    );
};

export default BookCardApproval;