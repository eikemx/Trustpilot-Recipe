# Trustpilot TypeScript-Node Recipe

This repository provides a TypeScript implementation for generating Trustpilot Business Generated Links (BGL). It allows you to create secure, encrypted review invitation links that you can send to your customers.

## Documentation and Resources

- [Trustpilot Business Generated Links Documentation](https://support.trustpilot.com/hc/en-us/articles/115002337108-What-are-Business-Generated-Links)
- [Trustpilot Developer Documentation](https://support.trustpilot.com/hc/en-us/articles/115004145087-Send-invitations-with-Business-Generated-Links)

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Trustpilot Business account with API access
- Encryption and Authentication keys from Trustpilot

## Project Structure

```
TRUSTPILOT/
├── src/
│   ├── trustpilot.ts
│   ├── trustpilot.spec.ts
│   ├── index.ts
│   └── logger.ts
├── node_modules/
├── .env
├── .gitignore
├── jest.config.js
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

## Getting Started

1. Clone this repository:
```
git clone git@github.com:eikemx/Trustpilot-Recipe.git
cd trustpilot-typescript-node-recipe
```
2. Install dependencies:
```
npm install
```
3. Set up your Trustpilot credentials:
- Create a `.env` file in the root directory
- Add your Trustpilot keys:
```    
TRUSTPILOT_ENCRYPTION_KEY=your_encryption_key_here
TRUSTPILOT_AUTHENTICATION_KEY=your_authentication_key_here
```
4. Run the example workflow:
```
npm start
```

## Features

This integration provides several functions to generate Trustpilot review invitation links:

### Payload Validation

Validate the required fields for a Trustpilot review invitation:
```typescript
import { validateTrustpilotPayload } from "./trustpilot";

const payload = {
  email: "rosie@cotton.com",
  name: "Rosie Cotton",
  ref: "ORDER123",
};

validateTrustpilotPayload(payload);
```

### Payload Construction

Create a properly formatted Trustpilot payload:
```typescript
import { constructTrustpilotPayload } from "./trustpilot";

const customerData = {
  email: "rosie@cotton.com",
  name: "Rosie Cotton",
  ref: "ORDER123",
  sku: ["SKU1", "SKU2"],
  tags: ["category1"],
};

const payload = constructTrustpilotPayload(customerData);
```

### Link Generation

Generate encrypted Trustpilot review invitation links:
```typescript
import { getBusinessGeneratedTrustpilotLink } from "./trustpilot";

const config = {
  encryptionKey: process.env.TRUSTPILOT_ENCRYPTION_KEY!,
  authenticationKey: process.env.TRUSTPILOT_AUTHENTICATION_KEY!,
  domain: "www.yourdomain.com",
};

const reviewLink = getBusinessGeneratedTrustpilotLink(payload, config);
```

## Error Handling

The integration includes custom error handling through the `TrustpilotError` class:
```typescript
try {
  const reviewLink = getBusinessGeneratedTrustpilotLink(payload, config);
} catch (error) {
  if (error instanceof TrustpilotError) {
    // Handle Trustpilot-specific errors
  }
  // Handle other errors
}
```

## Testing

This project uses Jest for unit testing. To run the tests:
```
npm test
```

The test suite in `src/trustpilot.spec.ts` covers:
1. Payload Validation
2. Payload Construction
3. Link Generation
4. Error Handling
5. Edge Cases

## Types and Interfaces

The integration includes TypeScript types and interfaces for Trustpilot-specific data structures:

- `TrustpilotPayload`: Defines the structure of customer and order data
- `TrustpilotConfig`: Defines the configuration options for link generation

## Best Practices

- Store sensitive keys in environment variables
- Validate all input data before generating links
- Implement proper error handling and logging
- Use TypeScript types for better code quality
- Follow the example in `src/index.ts` to structure your Trustpilot operations

## Contact

If you want to contact me, you can reach me at `<merxeike@gmail.com>`.
