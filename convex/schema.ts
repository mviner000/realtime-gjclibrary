import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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