"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Copy } from "lucide-react";
import { api } from "../../../convex/_generated/api";

export default function UuidSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);

  const accountId = useQuery(api.queries.accounts.getAccountIdBySchoolId, {
    schoolId: searchTerm,
  });

  // Add these debug logs
  console.log("Search term type:", typeof searchTerm);
  console.log("Search term value:", searchTerm);
  console.log("Account ID result type:", typeof accountId);
  console.log("Account ID result value:", accountId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted with term:", searchTerm);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log("Input changed to:", newValue);
    setSearchTerm(newValue);
  };

  const copyToClipboard = async () => {
    if (accountId) {
      try {
        await navigator.clipboard.writeText(accountId);
        console.log("Copied to clipboard:", accountId);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
          console.log("Copy notification cleared");
        }, 2000);
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Enter school ID..."
          className="flex-1"
        />
        <Button
          type="submit"
          onClick={() => console.log("Search button clicked")}
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {accountId && (
        <div className="mt-4">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <code className="flex-1 font-mono text-sm">{accountId}</code>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="hover:bg-gray-200"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {copied && (
            <p className="text-sm text-green-600 mt-2">Copied to clipboard!</p>
          )}
        </div>
      )}
    </div>
  );
}
