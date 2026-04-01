import { describe, it, expect } from "vitest";
import { classifyArticle, CATEGORIES, PROTOCOLS } from "@/lib/categories";

describe("classifyArticle", () => {
  it("classifies RTB article as Media Trading", () => {
    const result = classifyArticle("New DSP uses real-time bidding to optimize programmatic spend", "");
    expect(result.category).toBe("Media Trading");
  });

  it("classifies identity article as Data & Identity", () => {
    const result = classifyArticle("Third-party cookies are dead: first-party data strategies", "");
    expect(result.category).toBe("Data & Identity");
  });

  it("classifies retail media article", () => {
    const result = classifyArticle("Amazon retail media network grows 40%", "");
    expect(result.category).toBe("Retail Media");
  });

  it("tags MCP protocol", () => {
    const result = classifyArticle("Model Context Protocol gains traction in adtech", "");
    expect(result.protocols).toContain("MCP");
  });

  it("tags multiple protocols", () => {
    const result = classifyArticle("AdCP and A2A protocols compete for IAB adoption", "");
    expect(result.protocols).toContain("AdCP");
    expect(result.protocols).toContain("A2A");
  });

  it("returns null for unclassifiable", () => {
    const result = classifyArticle("Company announces new CEO", "leadership change");
    expect(result.category).toBeNull();
  });
});
