import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { Doc, Id } from "../_generated/dataModel";
import { normalizeSearchTerm } from "../helper";

const ITEMS_PER_PAGE = 10;
const SUGGESTION_LIMIT = 5;
const DEBOUNCE_MS = 300;

export const getAccountIdBySchoolId = query({
  args: {
    schoolId: v.string(),
  },
  handler: async (ctx, args) => {
    // Add debug logs
    console.log("Query executed with schoolId:", args.schoolId);

    // Convert schoolId to number for comparison
    const schoolIdNum = parseInt(args.schoolId, 10);

    const account = await ctx.db
      .query("accounts")
      .withIndex("by_school_id")
      .filter((q) => q.eq(q.field("school_id"), schoolIdNum))
      .first();

    // Add debug log for found account
    console.log("Found account:", account);

    if (!account) {
      return null;
    }

    return account._id;
  },
});

export const logSearch = mutation({
  args: {
    searchTerm: v.string(),
    normalizedSearchTerm: v.string(),
    resultsCount: v.number(),
    page: v.number(),
    isExactMatch: v.boolean(),
    searchType: v.union(
      v.literal("school_id"),
      v.literal("name"),
      v.literal("combined")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("searchLogs", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

// Updated search query without direct logging
export const searchAccounts = query({
  args: {
    searchTerm: v.string(),
    page: v.number(),
  },
  handler: async (ctx, args) => {
    const skip = (args.page - 1) * ITEMS_PER_PAGE;
    const searchTerm = normalizeSearchTerm(args.searchTerm);
    let searchType = "name";

    // First try exact school_id match
    if (!isNaN(Number(args.searchTerm))) {
      searchType = "school_id";
      const exactMatches = await ctx.db
        .query("accounts")
        .withIndex("by_school_id")
        .filter((q) => q.eq(q.field("school_id"), Number(args.searchTerm)))
        .collect();

      if (exactMatches.length > 0) {
        return {
          accounts: exactMatches,
          totalPages: 1,
          currentPage: 1,
          hasNextPage: false,
          hasPrevPage: false,
          searchMeta: {
            searchTerm: args.searchTerm,
            normalizedSearchTerm: searchTerm,
            resultsCount: exactMatches.length,
            isExactMatch: true,
            searchType,
          },
        };
      }
    }

    // Then do a case-insensitive search on names
    const results = await ctx.db
      .query("accounts")
      .filter((q) =>
        q.or(
          q.eq(q.field("school_id"), args.searchTerm),
          q.or(
            q.and(
              q.neq(q.field("first_name"), undefined),
              q.gte(q.field("first_name"), searchTerm),
              q.lt(q.field("first_name"), searchTerm + "\uffff")
            ),
            q.or(
              q.and(
                q.neq(q.field("last_name"), undefined),
                q.gte(q.field("last_name"), searchTerm),
                q.lt(q.field("last_name"), searchTerm + "\uffff")
              ),
              q.and(
                q.neq(q.field("middle_name"), undefined),
                q.gte(q.field("middle_name"), searchTerm),
                q.lt(q.field("middle_name"), searchTerm + "\uffff")
              )
            )
          )
        )
      )
      .collect();

    const filteredResults = results.filter((account) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        (account.first_name &&
          account.first_name.toLowerCase().includes(searchTermLower)) ||
        (account.middle_name &&
          account.middle_name.toLowerCase().includes(searchTermLower)) ||
        (account.last_name &&
          account.last_name.toLowerCase().includes(searchTermLower)) ||
        account.school_id.toString().includes(args.searchTerm)
      );
    });

    const totalResults = filteredResults.length;
    const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);
    const paginatedResults = filteredResults.slice(skip, skip + ITEMS_PER_PAGE);

    return {
      accounts: paginatedResults,
      totalPages,
      currentPage: args.page,
      hasNextPage: args.page < totalPages,
      hasPrevPage: args.page > 1,
      searchMeta: {
        searchTerm: args.searchTerm,
        normalizedSearchTerm: searchTerm,
        resultsCount: totalResults,
        isExactMatch: false,
        searchType: totalResults > 0 ? "combined" : searchType,
      },
    };
  },
});

export const getSearchSuggestions = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.searchTerm.length < 2) return [];

    const searchTerm = normalizeSearchTerm(args.searchTerm);

    const results = await ctx.db
      .query("accounts")
      .filter((q) =>
        q.or(
          q.eq(q.field("school_id"), args.searchTerm),
          q.or(
            q.and(
              q.neq(q.field("first_name"), undefined),
              q.gte(q.field("first_name"), searchTerm),
              q.lt(q.field("first_name"), searchTerm + "\uffff")
            ),
            q.or(
              q.and(
                q.neq(q.field("last_name"), undefined),
                q.gte(q.field("last_name"), searchTerm),
                q.lt(q.field("last_name"), searchTerm + "\uffff")
              ),
              q.and(
                q.neq(q.field("middle_name"), undefined),
                q.gte(q.field("middle_name"), searchTerm),
                q.lt(q.field("middle_name"), searchTerm + "\uffff")
              )
            )
          )
        )
      )
      .collect();

    // Post-process for case-insensitive matching and limit results
    const filteredResults = results
      .filter((account) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          (account.first_name &&
            account.first_name.toLowerCase().includes(searchTermLower)) ||
          (account.middle_name &&
            account.middle_name.toLowerCase().includes(searchTermLower)) ||
          (account.last_name &&
            account.last_name.toLowerCase().includes(searchTermLower)) ||
          account.school_id.toString().includes(args.searchTerm)
        );
      })
      .slice(0, SUGGESTION_LIMIT);

    return filteredResults;
  },
});

// You can also add an index mutation to help with search
export const updateSearchableFields = mutation({
  args: {
    id: v.id("accounts"),
    first_name: v.optional(v.string()),
    middle_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: any = {};

    if (args.first_name !== undefined) {
      updates.first_name = normalizeSearchTerm(args.first_name);
    }
    if (args.middle_name !== undefined) {
      updates.middle_name = normalizeSearchTerm(args.middle_name);
    }
    if (args.last_name !== undefined) {
      updates.last_name = normalizeSearchTerm(args.last_name);
    }

    await ctx.db.patch(args.id, updates);
  },
});
