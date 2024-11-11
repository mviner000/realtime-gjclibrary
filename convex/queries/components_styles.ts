
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

// Existing ComponentStyles mutations and queries
export const createComponentStyle = mutation({
  args: { 
    componentName: v.string(),
    tailwindClasses: v.string() 
  },
  handler: async (ctx, args) => {
    const newId = await ctx.db.insert("componentStyles", {
      componentName: args.componentName,
      tailwindClasses: args.tailwindClasses,
      updated_at: Date.now(),
    });
    return newId;
  },
});

export const updateComponentStyle = mutation({
  args: { 
    id: v.id("componentStyles"),
    tailwindClasses: v.string() 
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      tailwindClasses: args.tailwindClasses,
      updated_at: Date.now(),
    });
    return "updated";
  },
});

export const getComponentStyle = query({
  args: { componentName: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("componentStyles")
      .withIndex("by_componentName", (q) => 
        q.eq("componentName", args.componentName)
      )
      .first();
  },
});

export const getAllComponentStyles = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("componentStyles")
      .withIndex("by_updated")
      .order("desc")
      .collect();
  },
});

export const deleteComponentStyle = mutation({
  args: { id: v.id("componentStyles") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return "deleted";
  },
});