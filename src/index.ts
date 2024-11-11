import {
  constructTrustpilotPayload,
  getBusinessGeneratedTrustpilotLink,
} from "./trustpilot.js";

// Your configuration
const config = {
  encryptionKey: process.env.TRUSTPILOT_ENCRYPTION_KEY!,
  authenticationKey: process.env.TRUSTPILOT_AUTHENTICATION_KEY!,
};

// Example usage
const customerData = {
  email: "rosie@cotton.com",
  name: "Rosie Cotton",
  ref: "ORDER123",
  sku: ["SKU1", "SKU2"],
  tags: ["category1"],
};

try {
  const payload = constructTrustpilotPayload(customerData);
  const reviewLink = getBusinessGeneratedTrustpilotLink(payload, config);
  console.log(reviewLink);
} catch (error) {
  console.error("Failed to generate Trustpilot link:", error);
}
