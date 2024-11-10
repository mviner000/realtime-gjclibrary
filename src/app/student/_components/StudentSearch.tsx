"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';

export default function StudentSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsLoading(true);
      try {
        await router.push(`/student/${encodeURIComponent(searchQuery.trim())}`);
      } catch (error) {
        console.error('Navigation failed:', error);
      } finally {
        setIsLoading(false);
      }
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
            className="w-full h-12 px-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-lg bg-white shadow-sm dark:text-black disabled:bg-gray-100 disabled:text-gray-500"
            disabled={isLoading}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-md transition-all duration-300 text-sm font-medium flex items-center gap-2
              ${isLoading 
                ? 'bg-blue-400 cursor-not-allowed animate-pulse' 
                : 'hover:bg-blue-700 active:bg-blue-800'}`}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Loading...
              </>
            ) : (
              'Search'
            )}
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
}