/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as helper from "../helper.js";
import type * as queries_accounts from "../queries/accounts.js";
import type * as queries_clearance from "../queries/clearance.js";
import type * as queries_components_styles from "../queries/components_styles.js";
import type * as queries_pages from "../queries/pages.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  helper: typeof helper;
  "queries/accounts": typeof queries_accounts;
  "queries/clearance": typeof queries_clearance;
  "queries/components_styles": typeof queries_components_styles;
  "queries/pages": typeof queries_pages;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
