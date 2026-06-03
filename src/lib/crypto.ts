import { gcm } from "@noble/ciphers/aes";
import { randomBytes } from "@noble/ciphers/webcrypto";

function getKey(): Uint8Array {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("ENCRYPTION_KEY manquante dans les variables d'environnement");
  return Buffer.from(key, "hex");
}

export function encrypt(text: string): string {
  const iv = randomBytes(12);
  const cipher = gcm(getKey(), iv);
  const encrypted = cipher.encrypt(new TextEncoder().encode(text));
  return JSON.stringify({
    iv: Buffer.from(iv).toString("hex"),
    data: Buffer.from(encrypted).toString("hex"),
  });
}

export function decrypt(stored: string): string {
  const { iv, data } = JSON.parse(stored) as { iv: string; data: string };
  const cipher = gcm(getKey(), Buffer.from(iv, "hex"));
  const decrypted = cipher.decrypt(Buffer.from(data, "hex"));
  return new TextDecoder().decode(decrypted);
}

export function decryptIfExists(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return decrypt(value);
  } catch {
    return null;
  }
}
