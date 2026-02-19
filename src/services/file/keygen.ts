const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function generatePrivateKey(length = 32): string {
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (v) => CHARS[v % CHARS.length]).join("");
}
