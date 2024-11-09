"use client"

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Quote } from '@/types';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

const AdminQuotesPage = () => {
    const [quotes, setQuotes] = useState<Quote[]>([]); // Use the Quote type
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            const response = await fetch('/api/quote'); // Adjusted URL to match your API
            if (!response.ok) {
                throw new Error('Failed to fetch quotes');
            }

            // Get the response as an object
            const data = await response.json();

            // Convert the object to an array of Quote objects
            const quotesArray: Quote[] = Object.values(data);

            console.log(quotesArray); // Logs an array of quotes
            setQuotes(quotesArray);    // Now you can use setQuotes with an array
            setLoading(false);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
            setLoading(false);
        }
    };

    const handleApproval = async (quoteId: number, status: 'approved' | 'disapproved') => {
        try {
            const response = await fetch(`/api/quote/${quoteId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ approval_status: status }),
            });

            if (!response.ok) {
                throw new Error('Failed to update quote status');
            }

            const updatedQuote: Quote = await response.json(); // Ensure the response is typed
            setQuotes((prevQuotes) =>
                prevQuotes.map(quote => quote.id === updatedQuote.id ? updatedQuote : quote)
            );
            toast({
                title: "Quote Updated",
                description: `Quote ${quoteId} has been ${status}`,
            });
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
            });
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Quotes</h1>
            {Array.isArray(quotes) && quotes.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Quote Text</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Posted By</TableHead>
                            <TableHead>Approval Status</TableHead>
                            <TableHead>Approved By</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {quotes.map((quote) => (
                            <TableRow key={quote.id}>
                                <TableCell>{quote.text}</TableCell>
                                <TableCell>{quote.author}</TableCell>
                                <TableCell>{quote.posted_by}</TableCell>
                                <TableCell>{quote.approval_status}</TableCell>
                                <TableCell>{quote.approved_by || 'N/A'}</TableCell>
                                <TableCell className='flex gap-2'>
                                    <Button
                                        variant="emerald"
                                        className='w-auto gap-1'
                                        onClick={() => handleApproval(quote.id, 'approved')}
                                        disabled={quote.approval_status === 'approved'}

                                    ><ThumbsUp size={14} />
                                        Approve
                                    </Button>
                                    <Button
                                        onClick={() => handleApproval(quote.id, 'disapproved')}
                                        disabled={quote.approval_status === 'disapproved'}
                                        variant="ghost"
                                        className='gap-1 outline outline-1 outline-red-500'
                                    ><ThumbsDown size={14} />
                                        Disapprove
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <div>No quotes available</div>
            )}
        </div>
    );

};

export default AdminQuotesPage;