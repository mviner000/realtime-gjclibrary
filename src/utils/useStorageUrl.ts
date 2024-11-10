import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function useStorageUrl(storageId: Id<"_storage"> | undefined) {
  const url = useQuery(api.queries.getStorageUrl, storageId ? { storageId } : "skip");
  return url;
}