"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Loader, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Quote } from '@/types';
import { Button } from '@/components/ui/button';

const QuoteDetailsPage: React.FC = () => {
    const pathname = usePathname();
    const quoteId = pathname.split('/').pop(); // assuming the quoteId is at the end of the URL
    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [approvalLoading, setApprovalLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuoteDetails = async () => {
            if (quoteId && typeof quoteId === 'string') {
                setLoading(true);
                try {
                    const response = await fetch(`/api/quote/${quoteId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch quote details');
                    }
                    const data: Quote = await response.json();
                    setQuote(data);
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchQuoteDetails();
    }, [quoteId]);

    const handleApproval = async (status: Quote['approval_status']) => {
        if (!quoteId || typeof quoteId !== 'string') return;

        setApprovalLoading(true);
        try {
            const response = await fetch(`/api/quote/${quoteId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ approval_status: status }),
            });

            if (!response.ok) {
                throw new Error('Failed to update approval status');
            }

            const result: { approval_status: Quote['approval_status'] } = await response.json();
            setQuote(prevQuote => prevQuote ? { ...prevQuote, approval_status: result.approval_status } : null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setApprovalLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin" size={48} /></div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Quote Details</h1>
            {quote && (
                <div className="bg-white text-black shadow-lg rounded-lg p-6">
                    <p className="text-xl italic mb-2">&quot;{quote.text}&quot;</p>
                    <p className="text-right">- {quote.author}</p>
                    <p className="mt-4">Posted by: {quote.posted_by}</p>
                    <p className="mt-2">Status: {quote.approval_status}</p>
                    {quote.approved_by && <p className="mt-2">Approved by: {quote.approved_by}</p>}

                    {quote.approval_status === 'pending' && (
                        <div className="mt-6 flex justify-end space-x-4">
                            <Button
                                variant="emerald"
                                className='w-auto gap-1'
                                onClick={() => handleApproval('approved')}
                                disabled={approvalLoading}
                            ><ThumbsUp size={14} />
                                {approvalLoading ? <Loader className="animate-spin" size={20} /> : 'Approve'}
                            </Button>
                            <Button
                                variant="danger"
                                className='w-auto gap-1'
                                onClick={() => handleApproval('disapproved')}
                                disabled={approvalLoading}
                            ><ThumbsDown size={14} />
                                {approvalLoading ? <Loader className="animate-spin" size={20} /> : 'Disapprove'}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuoteDetailsPage;
