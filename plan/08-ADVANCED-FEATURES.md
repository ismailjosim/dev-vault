# Step 8: Advanced Features - Organizations & Enhancements

## Objective

Implement environment groups, tagging system, pinning, and multiple environments support.

## 8.1 Environment Groups (Multi-Environment Support)

### Features

- [ ] Support multiple environments per project:
  - Development
  - Production
  - Staging
  - Testing
  - Custom environments

### Structure

```
Project: Bistro Boss
├── development.env
│   ├── MONGODB_URI=mongodb://localhost
│   └── API_URL=http://localhost:3000
├── production.env
│   ├── MONGODB_URI=mongodb+srv://prod...
│   └── API_URL=https://bistro-boss.com
└── staging.env
    ├── MONGODB_URI=mongodb+srv://staging...
    └── API_URL=https://staging.bistro-boss.com
```

### Implementation

- [ ] Environment selector dropdown in project view
- [ ] Filter env vars by environment
- [ ] Copy full .env for specific environment
- [ ] Export by environment
- [ ] Switch environments easily
- [ ] Visual indicator of current environment

### Components

- `src/components/env/EnvironmentSelector.tsx`
- `src/components/env/EnvironmentTabs.tsx`

## 8.2 Tag System

### Features

- [ ] Add tags to projects and env variables
- [ ] Common tags for quick access:
  - nextjs, mern, react, nodejs
  - mongodb, firebase, supabase
  - cloudinary, stripe, aws
  - production, client, server, database
  - etc...

### Tag Management

- [ ] Browse all tags
- [ ] Filter projects by tags
- [ ] Search by tags
- [ ] Create custom tags
- [ ] Auto-suggestions while typing
- [ ] Show tag count/usage

### Components

- `src/components/common/TagInput.tsx`
- `src/components/common/TagCloud.tsx`
- `src/components/common/TagFilter.tsx`

## 8.3 Pin/Favorite Projects

### Features

- [ ] Pin important projects to top
- [ ] Visual star/pin indicator
- [ ] Quick access in dashboard
- [ ] Persistent storage

### UI

```
⭐ Bistro Boss (pinned)
⭐ Tour Management System (pinned)
  Portfolio V2
  Coffee Making Server
```

### Component

- `src/components/projects/PinProjectButton.tsx`

## 8.4 Environment Variables Expiry

### Features

- [ ] Set expiry dates for variables
- [ ] Auto-expiry types:
  - API keys (30, 60, 90 days)
  - OAuth tokens
  - Temporary credentials
  - SSL certificates
  - Access tokens

### Display

- [ ] Show expiry status:
  - 🟢 Active
  - 🟡 Expiring soon (within 7 days)
  - 🔴 Expired
- [ ] Expiry warning notifications
- [ ] Export report of expiring credentials

### Components

- `src/components/env/ExpiryDatePicker.tsx`
- `src/components/env/ExpiryBadge.tsx`
- `src/components/env/ExpiryWarning.tsx`

### Utilities

- `src/utils/expiry.ts`:
  - `isExpired(date)`
  - `daysUntilExpiry(date)`
  - `getExpiryStatus(date)`
  - `getExpiringVariables(days)`

## 8.5 Variable Notes & Documentation

### Features

- [ ] Add notes to each variable:

  ```
  MONGODB_URI
  Note: Created from MongoDB Atlas account with user: project_admin
        Last rotated: 2024-01-15
        Connection limit: 100
  ```

- [ ] Rich text notes (optional)
- [ ] Show notes in tooltip
- [ ] Markdown support in notes
- [ ] Link related snippets

### Components

- `src/components/env/NoteField.tsx`
- `src/components/env/NoteTooltip.tsx`

## 8.6 Project Documentation Section

### Features

- [ ] Store project metadata:
  - GitHub Client Repo (link)
  - GitHub Server Repo (link)
  - Live URL
  - Vercel URL
  - Heroku URL
  - Database name
  - Admin email
  - Test user email
  - Deployment notes
  - API documentation link
  - Team members
  - Status (active, archived, completed)

### Component

- `src/components/projects/ProjectDocs.tsx`

### Model Extension

```javascript
{
  // ... existing fields
  documentation: {
    clientRepo: String,
    serverRepo: String,
    liveURL: String,
    vercelURL: String,
    herokuURL: String,
    databaseName: String,
    adminEmail: String,
    testUserEmail: String,
    notes: String,
    status: String (active, archived, completed)
  }
}
```

## 8.7 Auto-lock Feature

### Features

- [ ] Auto-lock app after inactivity:
  - 5 minutes (default)
  - 10 minutes
  - 15 minutes
  - 30 minutes
  - Never
- [ ] Display countdown warning
- [ ] Store last activity time
- [ ] Re-authenticate to unlock

### Components

- `src/components/auth/AutoLockModal.tsx`
- `src/components/common/InactivityWarning.tsx`

### Hook

- `src/hooks/useAutoLock.ts`

## API Routes (New)

```
PATCH  /api/projects/:id/docs
PATCH  /api/projects/:id/pin
GET    /api/tags
POST   /api/env/:id/setExpiry
GET    /api/env/expiring
```

## Pages (New)

- `src/app/dashboard/tags/page.tsx`
- `src/app/dashboard/projects/[id]/docs/page.tsx`

## Database Schema Updates

- Add tags array to Project
- Add expiryDate to EnvVariable
- Add notes to EnvVariable
- Add documentation object to Project
- Add lastActivityTime to User

## Success Criteria

- ✅ Environment switching works
- ✅ Tags filter projects correctly
- ✅ Pin/favorite functionality works
- ✅ Expiry dates tracked and warned
- ✅ Project documentation stored
- ✅ Auto-lock triggers correctly

## Time Estimate: 2-2.5 hours
