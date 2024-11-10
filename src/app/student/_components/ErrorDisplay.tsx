import React from 'react';
import { TriangleAlert } from 'lucide-react';

interface ErrorDisplayProps {
    error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
    return (
        <div className="flex items-center justify-center bg-gradient-to-r text-2xl font-semibold p-8">
            <div className="animate-bounce flex">
                <div className="gap-1 flex items-center bg-red-100 text-red-800 font-medium me-2 px-2.5 py-0.5 rounded  dark:text-red-400 border border-red-400">
                    <TriangleAlert />
                    Error:
                </div>
                {error}
            </div>
        </div>
    );
};

export default ErrorDisplay;