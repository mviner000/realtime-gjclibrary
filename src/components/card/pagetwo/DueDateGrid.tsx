import React from 'react';

interface DueDateItemProps {
    isLast?: boolean;
}

const DueDateItem: React.FC<DueDateItemProps> = ({ isLast = false }) => (
    <div className={`pl-4 space-x-5 ${!isLast ? 'border-r border-black' : ''}`}>
        <div className="flex flex-row gap-4">
            <div className="flex flex-col">
                <span>Due</span>
                <span>date</span>
            </div>
            <div className="flex flex-col">
                <span>:</span>
                <span>:</span>
            </div>
            <div className="flex flex-col">
                <span>Call</span>
                <span>acc. #</span>
            </div>
        </div>
    </div>
);

const DueDateGrid: React.FC = () => {
    return (
        <div className="mx-10 border-t border-b border-black font-semibold">
            <div className="grid grid-cols-6">
                {[...Array(6)].map((_, index) => (
                    <DueDateItem key={index} isLast={index === 5} />
                ))}
            </div>
        </div>
    );
};

export default DueDateGrid;