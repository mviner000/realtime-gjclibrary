import { useState, useEffect } from 'react';
import { Account } from '@/types';

export const useStudentDetails = (studentId: string) => {
    const [account, setAccount] = useState<Account | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAccount = async () => {
            if (!studentId) {
                setError('No student ID provided');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const url = `/api/profile/student/${studentId}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setAccount(data);
            } catch (error) {
                setError('This account does not login yet');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccount();
    }, [studentId]);

    const handleApprovalChange = (newApprovalStatus: "approved" | "disapproved" | "pending") => {
        if (account) {
            setAccount({ ...account, isBookCardPhotoApproved: newApprovalStatus });
        }
    };

    return { account, isLoading, error, handleApprovalChange };
};