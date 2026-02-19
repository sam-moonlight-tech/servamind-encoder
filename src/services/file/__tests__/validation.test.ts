import { describe, it, expect } from "vitest";
import { getFileExtension, getFileName, isCompressedFile } from "../validation";

function createMockFile(name: string, size = 1024): File {
  return new File(["x".repeat(size)], name);
}

describe("getFileExtension", () => {
  it("returns extension for normal files", () => {
    expect(getFileExtension(createMockFile("test.pdf"))).toBe("pdf");
  });

  it("returns empty string for files without extension", () => {
    expect(getFileExtension(createMockFile("readme"))).toBe("");
  });

  it("returns last extension for double extensions", () => {
    expect(getFileExtension(createMockFile("archive.tar.gz"))).toBe("gz");
  });
});

describe("getFileName", () => {
  it("returns name without extension", () => {
    expect(getFileName("test.pdf")).toBe("test");
  });

  it("returns full name when no extension", () => {
    expect(getFileName("readme")).toBe("readme");
  });
});

describe("isCompressedFile", () => {
  it("returns true for .serva files", () => {
    expect(isCompressedFile(createMockFile("test.serva"))).toBe(true);
  });

  it("returns false for other files", () => {
    expect(isCompressedFile(createMockFile("test.pdf"))).toBe(false);
  });
});
