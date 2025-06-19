import crypto from "crypto";
import { AutumnError } from "src/sdk";

const getKey = () => {
  if (!process.env.AUTUMN_SECRET_KEY) {
    throw new AutumnError({
      message:
        "Autumn secret key not found in process.env.AUTUMN_SECRET_KEY. Please set it in your .env file.",
      code: "secret_key_not_found",
    });
  }

  return crypto
    .createHash("sha512")
    .update(process.env.AUTUMN_SECRET_KEY!)
    .digest("hex")
    .substring(0, 32);
};

export function encryptData(data: string) {
  let key: string;
  try {
    key = getKey();
  } catch (error: any) {
    throw new AutumnError({
      message: `Failed to encrypt customer ID. ${error.message}`,
      code: "encrypt_customer_id_failed",
    });
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(data, "utf8"),
    cipher.final(),
  ]);

  // Combine IV and encrypted data
  const result = Buffer.concat([iv, encrypted]);
  return result.toString("base64");
}

export function decryptData(encryptedData: string) {
  const buffer = Buffer.from(encryptedData, "base64");

  // Extract IV and encrypted data
  const iv = buffer.slice(0, 16);
  const encrypted = buffer.slice(16);

  const key = getKey();
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
