import { Buffer } from "buffer";
import crypto from "crypto";
import {
  TrustpilotPayload,
  validateTrustpilotPayload,
  constructTrustpilotPayload,
  getBusinessGeneratedTrustpilotLink,
} from "./trustpilot";

// First, declare the mock implementation
jest.mock("./logger", () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

// Then create a reference to access the mocked functions
const mockLogger = jest.mocked(require("./logger").default, { shallow: true });

describe("Trustpilot Integration", () => {
  // Test configuration
  const testConfig = {
    encryptionKey: "StwbunBzOTc3yRKdrWLQUTWcXY632jmcuHZMPtncdZI=",
    authenticationKey: "Yj2w5XlhA2Z0HztUzMUovuc8Awauxa2Obkwh/9DeFm8=",
    domain: "www.trustpilot.de",
  };

  // Valid test payload
  const validPayload: TrustpilotPayload = {
    email: "test@example.com",
    name: "Test User",
    ref: "ORDER123",
    sku: ["SKU1"],
    tags: ["tag1"],
  };

  describe("validateTrustpilotPayload", () => {
    it("should pass for valid payload", () => {
      expect(() => validateTrustpilotPayload(validPayload)).not.toThrow();
    });

    it("should throw error for missing email", () => {
      const invalidPayload = { ...validPayload, email: "" };
      expect(() => validateTrustpilotPayload(invalidPayload)).toThrow(
        "Missing required fields: email"
      );
    });

    it("should throw error for missing name", () => {
      const invalidPayload = { ...validPayload, name: "" };
      expect(() => validateTrustpilotPayload(invalidPayload)).toThrow(
        "Missing required fields: name"
      );
    });

    it("should throw error for missing ref", () => {
      const invalidPayload = { ...validPayload, ref: "" };
      expect(() => validateTrustpilotPayload(invalidPayload)).toThrow(
        "Missing required fields: ref"
      );
    });

    it("should pass without optional fields", () => {
      const minimalPayload = {
        email: "test@example.com",
        name: "Test User",
        ref: "ORDER123",
      };
      expect(() => validateTrustpilotPayload(minimalPayload)).not.toThrow();
    });
  });

  describe("constructTrustpilotPayload", () => {
    it("should construct valid payload with all fields", () => {
      const result = constructTrustpilotPayload(validPayload);
      expect(result).toEqual(validPayload);
    });

    it("should construct valid payload with only required fields", () => {
      const minimalPayload = {
        email: "test@example.com",
        name: "Test User",
        ref: "ORDER123",
      };
      const result = constructTrustpilotPayload(minimalPayload);
      expect(result).toEqual(minimalPayload);
    });

    it("should throw error for invalid payload", () => {
      const invalidPayload = { email: "test@example.com" } as any;
      expect(() => constructTrustpilotPayload(invalidPayload)).toThrow();
    });
  });

  describe("getBusinessGeneratedTrustpilotLink", () => {
    // Mock crypto.randomBytes to return consistent value for testing
    const mockIv = Buffer.from("1234567890123456");
    beforeEach(() => {
      jest.spyOn(crypto, "randomBytes").mockImplementation(() => mockIv);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should generate valid Trustpilot link", () => {
      const link = getBusinessGeneratedTrustpilotLink(validPayload, testConfig);

      // Verify link structure
      expect(link).toMatch(
        /^https:\/\/www\.trustpilot\.de\/evaluate-bgl\/embed\/<youraccountname>\?p=/
      );

      // Verify link contains base64 encoded payload
      const payloadParam = link.split("?p=")[1];
      expect(payloadParam).toBeTruthy();
      expect(() =>
        Buffer.from(decodeURIComponent(payloadParam), "base64")
      ).not.toThrow();
    });

    it("should throw error for missing configuration", () => {
      const invalidConfig = {
        encryptionKey: "",
        authenticationKey: "",
      };

      expect(() =>
        getBusinessGeneratedTrustpilotLink(validPayload, invalidConfig)
      ).toThrow("Missing required Trustpilot configuration keys");
    });

    it("should use default domain if not provided", () => {
      const configWithoutDomain = {
        encryptionKey: testConfig.encryptionKey,
        authenticationKey: testConfig.authenticationKey,
      };

      const link = getBusinessGeneratedTrustpilotLink(
        validPayload,
        configWithoutDomain
      );
      expect(link).toMatch(/^https:\/\/www\.trustpilot\.de\//);
    });

    it("should log info when generating link", () => {
      getBusinessGeneratedTrustpilotLink(validPayload, testConfig);
      expect(mockLogger.info).toHaveBeenCalled();
    });
  });
});
