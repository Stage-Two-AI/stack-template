import { describe, expect, it } from "vitest";
import { env } from "./env";

describe("env", () => {
  it("praat standaard met het schema public", () => {
    // Zonder VITE_SUPABASE_SCHEMA (zie vitest.config.ts) is dit een app met een eigen
    // database, en die praat met `public`. `api` is alleen voor een gedeelde database.
    expect(env.VITE_SUPABASE_SCHEMA).toBe("public");
  });
});
