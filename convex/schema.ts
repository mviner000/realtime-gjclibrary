import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  accounts: defineTable({
    school_id: v.union(v.string(), v.float64()),
    first_name: v.optional(v.string()),
    middle_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    gender: v.optional(
      v.union(v.literal("MALE"), v.literal("FEMALE"), v.literal("TOUPDATE"))
    ),
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

  clearance: defineTable({
    account_id: v.id("accounts"),
    semester_label: v.union(
      v.literal("1st Yr - 1st Sem"),
      v.literal("1st Yr - 2nd Sem"),
      v.literal("2nd Yr - 1st Sem"),
      v.literal("2nd Yr - 2nd Sem"),
      v.literal("3rd Yr - 1st Sem"),
      v.literal("3rd Yr - 2nd Sem"),
      v.literal("4th Yr - 1st Sem"),
      v.literal("4th Yr - 2nd Sem"),
      v.literal("5th Yr - 1st Sem"),
      v.literal("5th Yr - 2nd Sem")
    ),
    isCleared: v.boolean(),
    cleared_at: v.optional(v.number()),
    cleared_by: v.optional(v.string()),
  })
    .index("by_account_id", ["account_id"])
    .index("by_semester_label", ["semester_label"])
    .index("by_clearance_status", ["isCleared"]),

  searchLogs: defineTable({
    searchTerm: v.string(),
    normalizedSearchTerm: v.string(),
    resultsCount: v.number(),
    timestamp: v.number(),
    page: v.number(),
    isExactMatch: v.optional(v.boolean()),
    searchType: v.optional(
      v.union(v.literal("school_id"), v.literal("name"), v.literal("combined"))
    ),
    userRole: v.optional(v.string()),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_searchTerm", ["searchTerm"])
    .index("by_resultsCount", ["resultsCount"])
    .index("by_searchType", ["searchType"]),

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
