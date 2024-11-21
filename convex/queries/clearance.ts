import { v } from "convex/values";
import { query, mutation } from "../_generated/server";

// Define the semester label type to match schema
type SemesterLabel =
  | "1st Yr - 1st Sem"
  | "1st Yr - 2nd Sem"
  | "2nd Yr - 1st Sem"
  | "2nd Yr - 2nd Sem"
  | "3rd Yr - 1st Sem"
  | "3rd Yr - 2nd Sem"
  | "4th Yr - 1st Sem"
  | "4th Yr - 2nd Sem"
  | "5th Yr - 1st Sem"
  | "5th Yr - 2nd Sem";

// Query to get all clearance statuses for a school ID
export const getClearanceBySchoolId = query({
  args: {
    schoolId: v.string(),
  },
  handler: async (ctx, args) => {
    // Convert schoolId to number for comparison
    const schoolIdNum = parseInt(args.schoolId, 10);

    // First get the account
    const account = await ctx.db
      .query("accounts")
      .withIndex("by_school_id")
      .filter((q) => q.eq(q.field("school_id"), schoolIdNum))
      .first();

    if (!account) {
      return null;
    }

    // Get all clearance records for this account
    const clearanceRecords = await ctx.db
      .query("clearance")
      .withIndex("by_account_id")
      .filter((q) => q.eq(q.field("account_id"), account._id))
      .collect();

    return clearanceRecords;
  },
});

// Mutation to toggle clearance status
export const toggleClearanceStatus = mutation({
  args: {
    schoolId: v.string(),
    semesterLabel: v.union(
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
    clearedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const schoolIdNum = parseInt(args.schoolId, 10);

    // Get account
    const account = await ctx.db
      .query("accounts")
      .withIndex("by_school_id")
      .filter((q) => q.eq(q.field("school_id"), schoolIdNum))
      .first();

    if (!account) {
      throw new Error(`Account not found for school ID: ${args.schoolId}`);
    }

    // Check if clearance record exists
    const existingClearance = await ctx.db
      .query("clearance")
      .withIndex("by_account_id")
      .filter((q) =>
        q.and(
          q.eq(q.field("account_id"), account._id),
          q.eq(q.field("semester_label"), args.semesterLabel)
        )
      )
      .first();

    if (existingClearance) {
      // Update existing clearance
      await ctx.db.patch(existingClearance._id, {
        isCleared: args.isCleared,
        cleared_at: args.isCleared ? Date.now() : undefined,
        cleared_by: args.isCleared ? args.clearedBy : undefined,
      });
    } else {
      // Create new clearance record
      await ctx.db.insert("clearance", {
        account_id: account._id,
        semester_label: args.semesterLabel,
        isCleared: args.isCleared,
        cleared_at: args.isCleared ? Date.now() : undefined,
        cleared_by: args.isCleared ? args.clearedBy : undefined,
      });
    }
  },
});

export const createClearance = mutation({
  args: {
    schoolId: v.string(), // Changed from accountId to schoolId
    semesterLabel: v.union(
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
    clearedBy: v.string(),
  },
  handler: async (ctx, args) => {
    // First, find the account using school_id
    const schoolIdNum = parseInt(args.schoolId, 10);
    const account = await ctx.db
      .query("accounts")
      .withIndex("by_school_id")
      .filter((q) => q.eq(q.field("school_id"), schoolIdNum))
      .first();

    // Check if the account exists
    if (!account) {
      throw new Error(`Account not found for school ID: ${args.schoolId}`);
    }

    // Check if clearance already exists for this semester
    const existingClearance = await ctx.db
      .query("clearance")
      .withIndex("by_account_id")
      .filter((q) =>
        q.and(
          q.eq(q.field("account_id"), account._id),
          q.eq(q.field("semester_label"), args.semesterLabel)
        )
      )
      .first();

    if (existingClearance) {
      throw new Error(
        `Clearance already exists for this semester: ${args.semesterLabel}`
      );
    }

    // Create the clearance record
    const clearanceId = await ctx.db.insert("clearance", {
      account_id: account._id,
      semester_label: args.semesterLabel,
      isCleared: true,
      cleared_at: Date.now(),
      cleared_by: args.clearedBy,
    });

    return {
      clearanceId,
      accountId: account._id,
      schoolId: args.schoolId,
    };
  },
});
