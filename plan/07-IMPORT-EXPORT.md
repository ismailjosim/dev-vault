# Step 7: Import/Export & Utility Features

## Objective

Implement file import/export, .env.example generation, and missing env checker.

## 7.1 Import Existing .env File

### Features

- [ ] File upload dialog
- [ ] Paste raw .env content
- [ ] Parse KEY=VALUE format
- [ ] Handle comments and empty lines
- [ ] Validate key names
- [ ] Preview before import
- [ ] Auto-detect types (secret, api_key, url)
- [ ] Choose destination project
- [ ] Merge with existing or replace

### Implementation

- Parser function to extract key-value pairs
- Validation for key names (alphanumeric, underscore)
- UI for preview and confirmation

### Component

- `src/components/import/ImportEnvFile.tsx`
- `src/components/import/ImportPreview.tsx`

### Utilities

- `src/utils/envParser.ts`:
  - `parseEnvContent(content)`
  - `validateKeyName(key)`
  - `detectEnvType(key, value)`

## 7.2 Export .env Variations

### Export Formats

- [ ] `.env` - Standard format
- [ ] `.env.local` - Local development
- [ ] `.env.production` - Production values
- [ ] `.env.example` - No values (template)
- [ ] `.env.development` - Dev specific
- [ ] `.env.test` - Test values
- [ ] JSON format
- [ ] YAML format
- [ ] Markdown documentation

### Features

- [ ] Select environment to export
- [ ] Choose format
- [ ] Download file
- [ ] Copy to clipboard
- [ ] Generate .env.example automatically
- [ ] Include comments/notes

### Component

- `src/components/export/ExportModal.tsx`

### Utilities

- `src/utils/envExporter.ts`:
  - `generateEnvFile(variables, format)`
  - `generateEnvExample(variables)`
  - `formatAsJSON(variables)`
  - `formatAsYAML(variables)`
  - `formatAsMarkdown(variables)`

## 7.3 Generate .env.example

### Features

- [ ] From project environment variables:
  - Remove values
  - Keep key names
  - Add descriptions/notes as comments
- [ ] Two output options:

  ```env
  # Option 1: Empty values
  MONGODB_URI=
  JWT_SECRET=

  # Option 2: Descriptive placeholders
  MONGODB_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret_key
  ```

- [ ] Include variable descriptions as comments:

  ```env
  # MongoDB connection string (Atlas)
  MONGODB_URI=

  # JWT token secret (minimum 32 characters)
  JWT_SECRET=
  ```

- [ ] Download or copy to clipboard
- [ ] Auto-generate on project creation

### Component

- `src/components/export/GenerateExample.tsx`

## 7.4 Missing Env Checker

### Features

- [ ] Upload or paste `.env.example` file
- [ ] Compare with project's saved env vars
- [ ] Show missing variables
- [ ] Show available variables
- [ ] Show extra variables (in project but not in example)
- [ ] Suggest adding missing vars
- [ ] Quick action to add missing vars

### Output Example

```
📋 Env Comparison for: Bistro Boss

✅ Available Variables (8):
- MONGODB_URI
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- STRIPE_SECRET_KEY
- FIREBASE_API_KEY

❌ Missing Variables (2):
- STRIPE_WEBHOOK_SECRET
- CLOUDINARY_SECURE_URL

⚠️ Extra Variables (1):
- LEGACY_API_KEY (not in .env.example)

[Add Missing] [Remove Extra] [Export Report]
```

### Component

- `src/components/tools/EnvChecker.tsx`

### Utilities

- `src/utils/envChecker.ts`:
  - `compareEnvFiles(example, project)`
  - `getMissingVars(example, project)`
  - `getExtraVars(example, project)`
  - `generateComparisonReport(example, project)`

## 7.5 .env Validation

### Features

- [ ] Validate syntax of .env files
- [ ] Check for duplicate keys
- [ ] Check for invalid characters in keys
- [ ] Check for empty values (optional warning)
- [ ] Security warnings (plain text secrets)
- [ ] Length validation for values
- [ ] Format validation for known types

### Utilities

- `src/utils/envValidator.ts`:
  - `validateEnvFile(content)`
  - `checkDuplicateKeys(variables)`
  - `validateKeyFormat(key)`
  - `validateValueFormat(key, value)`

## API Routes

```
POST   /api/import/env
POST   /api/export/env
POST   /api/export/example
POST   /api/tools/check-missing
POST   /api/tools/validate-env
```

## Pages

- `src/app/dashboard/tools/import/page.tsx`
- `src/app/dashboard/tools/export/page.tsx`
- `src/app/dashboard/tools/env-checker/page.tsx`

## Dependencies

```bash
pnpm add dotenv-parse-key
```

## Success Criteria

- ✅ Can import .env files correctly
- ✅ Can export in multiple formats
- ✅ .env.example generation works
- ✅ Missing env checker detects differences
- ✅ File upload and paste both work
- ✅ Validation catches errors

## Time Estimate: 2 hours
