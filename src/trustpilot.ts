import { Buffer } from "buffer";
import crypto from "crypto";
import logger from "./logger.js";

export interface TrustpilotPayload {
  email: string;
  name: string;
  ref: string;
  sku?: string[];
  tags?: string[];
}

interface TrustpilotConfig {
  encryptionKey: string;
  authenticationKey: string;
  domain?: string;
}

class TrustpilotError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TrustpilotError";
  }
}

// Validates the required fields in the Trustpilot payload
// @param data The data to validate
// @throws {TrustpilotError} If required fields are missing

export function validateTrustpilotPayload(
  data: Partial<TrustpilotPayload>
): asserts data is TrustpilotPayload {
  const requiredFields = ["email", "name", "ref"];
  const missingFields = requiredFields.filter(
    (field) => !(field in data) || !data[field as keyof typeof data]
  );

  if (missingFields.length > 0) {
    throw new TrustpilotError(
      `Missing required fields: ${missingFields.join(", ")}`
    );
  }
}

// Constructs a valid Trustpilot payload from input data
// @param data The input data to construct the payload from
// @returns A validated TrustpilotPayload

export function constructTrustpilotPayload(
  data: Partial<TrustpilotPayload>
): TrustpilotPayload {
  validateTrustpilotPayload(data);

  return {
    email: data.email,
    name: data.name,
    ref: data.ref,
    ...(data.sku && { sku: data.sku }),
    ...(data.tags && { tags: data.tags }),
  };
}

// Generates a Trustpilot review invitation link
// @param trustpilotPayload The payload containing customer and order information
// @param config The Trustpilot configuration containing encryption and authentication keys
// @returns A URL that can be sent to customers for leaving reviews
// @throws {TrustpilotError} If required configuration is missing

export function getBusinessGeneratedTrustpilotLink(
  trustpilotPayload: TrustpilotPayload,
  config: TrustpilotConfig
): string {
  try {
    logger.info("Generating Trustpilot link", {
      ref: trustpilotPayload.ref,
      email: trustpilotPayload.email,
    });

    if (!config.encryptionKey || !config.authenticationKey) {
      throw new TrustpilotError(
        "Missing required Trustpilot configuration keys"
      );
    }

    // Decode the base64 keys
    const encryptionKey = Buffer.from(config.encryptionKey, "base64");
    const authenticationKey = Buffer.from(config.authenticationKey, "base64");

    // Generate initialization vector
    const iv = crypto.randomBytes(16);

    // Encrypt the payload
    const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
    const cipherText = Buffer.concat([
      cipher.update(JSON.stringify(trustpilotPayload), "utf8"),
      cipher.final(),
    ]);

    // Compute HMAC
    const hmac = crypto
      .createHmac("sha256", authenticationKey)
      .update(Buffer.concat([iv, cipherText]))
      .digest();

    // Combine and encode the final payload
    const base64Payload = Buffer.concat([iv, cipherText, hmac]).toString(
      "base64"
    );
    const urlEncodedPayload = encodeURIComponent(base64Payload);

    // Generate the final URL
    const domain = config.domain || "www.trustpilot.de";
    return `https://${domain}/evaluate-bgl/embed/<youraccountname>?p=${urlEncodedPayload}`;
  } catch (error) {
    logger.error("Failed to generate Trustpilot link", {
      error: error instanceof Error ? error.message : "Unknown error",
      ref: trustpilotPayload.ref,
    });
    throw error;
  }
}
