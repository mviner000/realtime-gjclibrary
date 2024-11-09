import React from 'react';
import { CheckIcon, XIcon, ClockIcon } from 'lucide-react';

type ApprovalStatus = "approved" | "disapproved" | "pending";

interface ApprovalStatusProps {
    status: ApprovalStatus;
}

const ApprovalStatus: React.FC<ApprovalStatusProps> = ({ status }) => {
    switch (status) {
        case 'approved':
            return (
                <span className="flex items-center text-green-700/90">
                    <CheckIcon className="mr-1" size={18} /> Approved
                </span>
            );
        case 'disapproved':
            return (
                <span className="flex items-center text-rose-700/90">
                    <XIcon className="mr-1" size={18} /> Disapproved
                </span>
            );
        case 'pending':
            return (
                <span className="flex items-center text-orange-700/90">
                    <ClockIcon className="mr-1" size={18} /> Pending
                </span>
            );
        default:
            return null;
    }
};

export default ApprovalStatus;