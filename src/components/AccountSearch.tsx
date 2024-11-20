"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import debounce from "lodash/debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { AccountType } from "../types";
import { api } from "../../convex/_generated/api";
import useClickOutside from "@/hooks/useClickOutside";
import Link from "next/link";

const DEBOUNCE_MS = 300;

interface SearchResultsType {
  accounts: AccountType[];
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  searchMeta: {
    searchTerm: string;
    normalizedSearchTerm: string;
    resultsCount: number;
    isExactMatch: boolean;
    searchType: "school_id" | "name" | "combined";
  };
}

export default function Component() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const logSearch = useMutation(api.queries.accounts.logSearch);

  const searchResults = useQuery(api.queries.accounts.searchAccounts, {
    searchTerm,
    page,
  }) as SearchResultsType | undefined;

  const suggestions = useQuery(api.queries.accounts.getSearchSuggestions, {
    searchTerm,
  }) as AccountType[] | undefined;

  // Move the debounced function creation outside of useCallback
  const setShowSuggestionsDebounced = debounce((term: string) => {
    setShowSuggestions(term.length >= 2);
  }, DEBOUNCE_MS);

  // Wrap the debounced function call in useCallback
  const debouncedSearch = useCallback((term: string) => {
    setShowSuggestionsDebounced(term);
  }, []); // Empty dependencies array since setShowSuggestionsDebounced is stable

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      setShowSuggestionsDebounced.cancel();
    };
  }, [searchTerm, debouncedSearch, setShowSuggestionsDebounced]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    setPage(1);

    if (searchResults?.searchMeta) {
      const { searchMeta } = searchResults;
      await logSearch({
        searchTerm: searchMeta.searchTerm,
        normalizedSearchTerm: searchMeta.normalizedSearchTerm,
        resultsCount: searchMeta.resultsCount,
        page: page,
        isExactMatch: searchMeta.isExactMatch,
        searchType: searchMeta.searchType,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
    setPage(1);
  };

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);

    if (searchResults?.searchMeta) {
      const { searchMeta } = searchResults;
      await logSearch({
        searchTerm: searchMeta.searchTerm,
        normalizedSearchTerm: searchMeta.normalizedSearchTerm,
        resultsCount: searchMeta.resultsCount,
        page: newPage,
        isExactMatch: searchMeta.isExactMatch,
        searchType: searchMeta.searchType,
      });
    }
  };

  const searchRef = useClickOutside(() => {
    setShowSuggestions(false);
  });

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div ref={searchRef} className="relative">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by school ID or name..."
              className="pr-10 w-full"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>

        {showSuggestions && suggestions && suggestions.length > 0 && (
          <div className="absolute w-full bg-white mt-1 rounded-md shadow-lg border border-gray-200 z-10 max-h-60 overflow-y-auto">
            {suggestions.map((account) => (
              <button
                key={account._id}
                onClick={() => {
                  setSearchTerm(account.school_id.toString());
                  setShowSuggestions(false);
                }}
                className="w-full px-4 py-2 text-left dark:text-black hover:bg-gray-100 cursor-pointer"
              >
                {account.school_id} - {account.first_name} {account.last_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {searchResults && (
        <div className="mt-6">
          {searchResults.searchMeta.resultsCount > 0 ? (
            <>
              <div className="mb-4 text-sm text-gray-600">
                {searchResults.searchMeta.isExactMatch ? (
                  <p>Exact match found</p>
                ) : (
                  <p>Found {searchResults.searchMeta.resultsCount} results</p>
                )}
              </div>

              <div className="space-y-4">
                {searchResults.accounts.map((account) => (
                  <div key={account._id} className="block">
                    <Link href={`/students/${account.school_id}`}>
                      <div className="p-4 border rounded-lg hover:bg-gray-50 hover:text-gray-600 hover:cursor-pointer">
                        <h3 className="font-medium">
                          {account.first_name} {account.middle_name}{" "}
                          {account.last_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          School ID: {account.school_id}
                        </p>
                        {account.role && (
                          <p className="text-sm text-gray-600">
                            {account.role}
                            {account.department &&
                              ` - ${account.department}`} • {account.course} •{" "}
                            {account.year_level}
                          </p>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {searchResults.totalPages > 1 && (
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                  <Button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={!searchResults.hasPrevPage}
                    className="w-full sm:w-auto"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {searchResults.currentPage} of{" "}
                    {searchResults.totalPages}
                  </span>
                  <Button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!searchResults.hasNextPage}
                    className="w-full sm:w-auto"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-600">
              No accounts found matching &quot;
              {searchResults.searchMeta.searchTerm}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
