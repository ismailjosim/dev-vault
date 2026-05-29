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

- [ ] Initialize Next.js project: `npx create-next-app@latest devvault --typescript --tailwind --app`
- [ ] Install base dependencies:

  ```
  pnpm add react react-dom next
  pnpm add -D typescript @types/react @types/node
  ```

- [ ] Configure `tsconfig.json` and `next.config.js`

### 1.3 Install Core Dependencies

```bash
pnpm add mongodb mongoose
pnpm add next-auth @auth/mongodb-adapter
pnpm add zod react-hook-form
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu
pnpm add clsx tailwind-merge class-variance-authority
pnpm add lucide-react
pnpm add crypto-js dotenv
```

### 1.4 Development Dependencies

```bash
pnpm add -D @types/crypto-js
pnpm add -D tailwindcss postcss autoprefixer
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
