# Step 1: Project Setup & Initialization

## Objective

Set up the project structure, configure tooling, and initialize the repository.

## Tasks

### 1.1 Initialize Repository

- [ ] Create repository structure
- [ ] Initialize git
- [ ] Add `.gitignore` (Node.js, Next.js, environment files)
- [ ] Create initial README.md

### 1.2 Project Setup

**Requirements:**

- Node.js v20.9 or higher
- pnpm (recommended) or npm

**Initialize Next.js (Latest v16):**

```bash
pnpm create next-app@latest devvault --yes
cd devvault
pnpm dev
```

This sets up:

- TypeScript (latest)
- Tailwind CSS v3
- ESLint/Biome
- App Router
- Turbopack (default bundler)
- `@/*` import alias

### 1.3 Install Core Dependencies

**Authentication & Database:**

```bash
pnpm add better-auth@latest
pnpm add mongodb mongoose
pnpm add bcryptjs
```

**UI & Validation:**

```bash
pnpm add zod react-hook-form
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu
pnpm add clsx tailwind-merge class-variance-authority
pnpm add lucide-react
```

**Utilities:**

```bash
pnpm add crypto-js dotenv
pnpm add framer-motion
```

### 1.4 Development Dependencies

```bash
pnpm add -D @types/crypto-js @types/bcryptjs
pnpm add -D @types/node typescript
```

### 1.5 Project Structure

```
devvault/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── models/
│   ├── utils/
│   └── types/
├── public/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Success Criteria

- ✅ Project initializes without errors
- ✅ All dependencies installed
- ✅ `.env.example` created
- ✅ Git repository initialized

## Time Estimate: 30-45 minutes
