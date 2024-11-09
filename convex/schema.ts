import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  componentStyles: defineTable({
    componentName: v.string(),
    tailwindClasses: v.string(),
    updated_at: v.number(),
  })
    .index("by_componentName", ["componentName"])
    .index("by_updated", ["updated_at"]),
});