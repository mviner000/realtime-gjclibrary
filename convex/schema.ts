import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  accounts: defineTable({
    // Changed to handle numeric school IDs
    school_id: v.union(v.string(), v.float64()),  // Now accepts both string and number
    
    // Rest of the fields remain the same
    first_name: v.optional(v.string()),
    middle_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    gender: v.optional(v.union(
      v.literal("MALE"),
      v.literal("FEMALE"),
      v.literal("TOUPDATE")
    )),
    course: v.optional(v.string()),
    department: v.optional(v.string()),
    position: v.optional(v.string()),
    major: v.optional(v.string()),
    year_level: v.optional(v.string()),
    role: v.optional(v.union(v.literal("Student"), v.literal("Faculty"))),
    
    updated_at: v.optional(v.number()),
  })
  .index("by_school_id", ["school_id"])
  .index("by_role", ["role"])
  .index("by_department", ["department"])
  .index("by_course", ["course"])
  .index("by_updated", ["updated_at"])
  .index("by_normalized_names", ["first_name", "last_name", "middle_name"]),

  // New searchLogs table for tracking search requests
  searchLogs: defineTable({
    searchTerm: v.string(),
    normalizedSearchTerm: v.string(),
    resultsCount: v.number(),
    timestamp: v.number(),
    page: v.number(),
    isExactMatch: v.optional(v.boolean()),
    // Additional fields that might be useful for analytics
    searchType: v.optional(v.union(
      v.literal("school_id"),
      v.literal("name"),
      v.literal("combined")
    )),
    userRole: v.optional(v.string()), // If you want to track who's searching
  })
  .index("by_timestamp", ["timestamp"])
  .index("by_searchTerm", ["searchTerm"])
  .index("by_resultsCount", ["resultsCount"])
  .index("by_searchType", ["searchType"]),

  // Keep your existing tables
  pages: defineTable({
    pageNumber: v.number(),
    pageUrl: v.string(),
    proposedBy: v.string(),
    proposedDate: v.string(),
    updatedCounts: v.number(),
    lastUpdateDate: v.string(),
    approvedBy: v.string(),
    notes: v.string(),
    updated_at: v.number(),
    isChecked: v.optional(v.boolean()),
    imageId: v.optional(v.id("_storage")),
  })
  .index("by_pageNumber", ["pageNumber"])
  .index("by_proposedBy", ["proposedBy"])
  .index("by_updated", ["updated_at"]),

  componentStyles: defineTable({
    componentName: v.string(),
    tailwindClasses: v.string(),
    updated_at: v.number(),
  })
  .index("by_componentName", ["componentName"])
  .index("by_updated", ["updated_at"]),
});