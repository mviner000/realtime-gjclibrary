import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Page mutations and queries
export const createPage = mutation({
  args: {
    pageNumber: v.number(),
    pageUrl: v.string(),
    proposedBy: v.string(),
    proposedDate: v.string(),
    approvedBy: v.string(),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const newId = await ctx.db.insert("pages", {
      ...args,
      updatedCounts: 0,
      lastUpdateDate: new Date().toISOString(),
      updated_at: Date.now(),
      isChecked: false, // Initialize isChecked field
    });
    return newId;
  },
});

export const updatePage = mutation({
  args: {
    id: v.id("pages"),
    pageUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const page = await ctx.db.get(id);
    
    if (!page) throw new Error("Page not found");
    
    await ctx.db.patch(id, {
      ...updates,
      updatedCounts: (page.updatedCounts || 0) + 1,
      lastUpdateDate: new Date().toISOString(),
      updated_at: Date.now(),
    });
    return "updated";
  },
});

export const checkPage = mutation({
  args: {
    id: v.id("pages"),
    isChecked: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, isChecked } = args;
    const page = await ctx.db.get(id);
    
    if (!page) throw new Error("Page not found");
    
    await ctx.db.patch(id, {
      isChecked,
      updatedCounts: (page.updatedCounts || 0) + 1,
      lastUpdateDate: new Date().toISOString(),
      updated_at: Date.now(),
    });
    return "checked";
  },
});

export const getPageByNumber = query({
  args: { pageNumber: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pages")
      .withIndex("by_pageNumber", (q) => 
        q.eq("pageNumber", args.pageNumber)
      )
      .first();
  },
});

export const getPagesByProposer = query({
  args: { proposedBy: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pages")
      .withIndex("by_proposedBy", (q) => 
        q.eq("proposedBy", args.proposedBy)
      )
      .collect();
  },
});

export const getAllPages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("pages")
      .withIndex("by_updated")
      .order("desc")
      .collect();
  },
});

export const deletePage = mutation({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return "deleted";
  },
});

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