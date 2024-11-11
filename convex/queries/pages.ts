
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

// Generate upload URL
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Store file reference
export const saveImage = mutation({
  args: {
    pageId: v.id("pages"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const { pageId, storageId } = args;
    await ctx.db.patch(pageId, { imageId: storageId });
  },
});

// Delete stored file
export const deleteImage = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.storageId);
  },
});

// Page mutations and queries
export const createPage = mutation({
  args: {
    pageNumber: v.number(),
    pageUrl: v.string(),
    proposedBy: v.string(),
    proposedDate: v.string(),
    approvedBy: v.string(),
    notes: v.string(),
    imageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const newId = await ctx.db.insert("pages", {
      ...args,
      updatedCounts: 0,
      lastUpdateDate: new Date().toISOString(),
      updated_at: Date.now(),
      isChecked: false,
    });
    return newId;
  },
});

export const updatePage = mutation({
  args: {
    id: v.id("pages"),
    pageUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const page = await ctx.db.get(id);
    if (!page) throw new Error("Page not found");

    // If there's an existing image and we're updating to a new one,
    // delete the old image
    if (page.imageId && updates.imageId && page.imageId !== updates.imageId) {
      await ctx.storage.delete(page.imageId);
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedCounts: (page.updatedCounts || 0) + 1,
      lastUpdateDate: new Date().toISOString(),
      updated_at: Date.now(),
    });
    return "updated";
  },
});

export const getStorageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const checkPage = mutation({
  args: {
    id: v.id("pages"),
    isChecked: v.boolean(),
    approvedBy: v.string()
  },
  handler: async (ctx, args) => {
    const { id, isChecked, approvedBy } = args;
    const page = await ctx.db.get(id);
    
    if (!page) throw new Error("Page not found");
    
    await ctx.db.patch(id, {
      isChecked,
      approvedBy,
      updatedCounts: (page.updatedCounts || 0) + 1,
      lastUpdateDate: new Date().toISOString(),
      updated_at: Date.now()
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
