import { describe, it, expect } from "vitest";
import { computeSha256 } from "../checksum";

function createFileWithArrayBuffer(bytes: number[], name: string): File {
  const blob = new Blob([new Uint8Array(bytes)]);
  const file = new File([blob], name);
  // Create a proper ArrayBuffer copy for jsdom compatibility
  const ab = new ArrayBuffer(bytes.length);
  new Uint8Array(ab).set(bytes);
  file.arrayBuffer = () => Promise.resolve(ab);
  return file;
}

describe("computeSha256", () => {
  it("returns a hex string of correct length", async () => {
    const content = [104, 101, 108, 108, 111];
    const file = createFileWithArrayBuffer(content, "test.txt");

    const hash = await computeSha256(file);
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]+$/);
  });

  it("returns consistent hash for same content", async () => {
    const content = [116, 101, 115, 116];
    const file1 = createFileWithArrayBuffer(content, "a.txt");
    const file2 = createFileWithArrayBuffer(content, "b.txt");

    const hash1 = await computeSha256(file1);
    const hash2 = await computeSha256(file2);
    expect(hash1).toBe(hash2);
  });
});
