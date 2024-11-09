"use client"

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const SettingsBreadcrumb = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const isLast = index === pathSegments.length - 1;
    
    // Convert path segments to readable text
    const readableText = segment
      .split(/(?=[A-Z])/)
      .join(' ')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());

    return (
      <div key={path} className="flex items-center">
        {index > 0 && (
          <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
        )}
        {isLast ? (
          <span className="text-gray-600 font-medium">
            {readableText}
          </span>
        ) : (
          <Link 
            href={path}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {readableText}
          </Link>
        )}
      </div>
    );
  });

  return (
    <nav className="flex w-3/4 items-center p-4 bg-gray-100 rounded-lg mb-4">
      <Link 
        href="/" 
        className="text-blue-600 hover:text-blue-800 hover:underline mx-2"
      >
        Home /
      </Link>
      {breadcrumbItems}
    </nav>
  );
};

export default SettingsBreadcrumb;