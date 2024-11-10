"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

const StudentSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/student/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter school id..."
            className="w-full h-12 px-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-lg bg-white shadow-sm dark:text-black"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </div>
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
          >
            Search
          </button>
        </div>
        
        <img
          className="mt-10"
          src="/images/student_library_card.jpg"
          width={640}
          height="auto"
          alt="General De Jesus Logo"
        />
      </form>
    </div>
  );
};

export default StudentSearch;