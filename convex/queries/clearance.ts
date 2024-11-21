import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const createClearance = mutation({
  args: {
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
    isCleared: v.optional(v.boolean()),
    cleared_at: v.optional(v.number()),
    cleared_by: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const newId = await ctx.db.insert("clearance", {
      account_id: args.account_id,
      semester_label: args.semester_label,
      isCleared: args.isCleared || false,
      cleared_at: args.cleared_at,
      cleared_by: args.cleared_by,
    });
    return newId;
  },
});

export const updateClearance = mutation({
  args: {
    id: v.id("clearance"),
    isCleared: v.optional(v.boolean()),
    cleared_at: v.optional(v.number()),
    cleared_by: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isCleared: args.isCleared,
      cleared_at: args.cleared_at,
      cleared_by: args.cleared_by,
    });
    return "updated";
  },
});

export const getClearanceByAccountAndSemester = query({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("clearance")
      .filter((q) =>
        q.and(
          q.eq(q.field("account_id"), args.account_id),
          q.eq(q.field("semester_label"), args.semester_label)
        )
      )
      .first();
  },
});

export const getAllClearancesByAccount = query({
  args: { account_id: v.id("accounts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("clearance")
      .filter((q) => q.eq(q.field("account_id"), args.account_id))
      .collect();
  },
});

export const deleteClearance = mutation({
  args: { id: v.id("clearance") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return "deleted";
  },
});

export const getAllUnclearedClearances = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("clearance")
      .filter((q) => q.eq(q.field("isCleared"), false))
      .collect();
  },
});
