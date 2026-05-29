# Step 4: Core Features - Project & Env Management

## Objective

Implement CRUD operations for projects and environment variables.

## Features

### 4.1 Project Management

#### Create Project

- [ ] Form to create new project with:
  - Project name
  - Description
  - Category (Full Stack, Frontend, Backend)
  - Framework (Next.js, MERN, etc)
  - Tags
- [ ] Auto-generate slug from project name
- [ ] Store in database linked to user
- [ ] Redirect to project page

#### Read Projects

- [ ] Display all user's projects on dashboard
- [ ] Show project card with:
  - Project name
  - Framework/category badge
  - Tags
  - Created date
  - Pin status
- [ ] Implement pagination/infinite scroll
- [ ] Show "No projects" state

#### Update Project

- [ ] Edit project details
- [ ] Update tags
- [ ] Change framework/category
- [ ] Pin/unpin projects

#### Delete Project

- [ ] Confirm deletion dialog
- [ ] Delete all env variables associated
- [ ] Remove from favorites
- [ ] Redirect to dashboard

### 4.2 Environment Variable Management

#### Add Env Variables

- [ ] Form with:
  - Key input
  - Value input
  - Type dropdown (secret, jwt, api_key, url, other)
  - Public/Secret toggle
  - Note/description
  - Environment selector (dev, prod, staging)
  - Expiry date (optional)
- [ ] Values encrypted before storage
- [ ] Show success toast

#### Display Env Variables

- [ ] Table/list view of all variables
- [ ] Hide values by default (show masked)
- [ ] Reveal button (eye icon)
- [ ] Color-code by type
- [ ] Filter by environment
- [ ] Show expiry warning if near expiry

#### Edit Env Variables

- [ ] Update key, value, type, note
- [ ] Re-encrypt updated value
- [ ] Show "updated X hours ago"

#### Delete Env Variables

- [ ] Quick delete with undo toast
- [ ] Permanent deletion

#### Copy Operations

- [ ] Copy key only
- [ ] Copy value only
- [ ] Copy KEY=VALUE format
- [ ] Copy full .env file content
- [ ] Auto-clear clipboard after 30 seconds
- [ ] Show copy success feedback

#### Export Functions

- [ ] Export as .env file (download)
- [ ] Export as .env.local
- [ ] Export as .env.production
- [ ] Export as JSON
- [ ] Generate .env.example (no values)

### 4.3 Search & Filter

#### Search

- [ ] Search projects by name
- [ ] Real-time search with debounce
- [ ] Highlight matching results

#### Filter

- [ ] Filter by framework/category
- [ ] Filter by tags
- [ ] Filter by environment

## API Routes

```
POST   /api/projects
GET    /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id

POST   /api/projects/:id/env
GET    /api/projects/:id/env
PATCH  /api/projects/:id/env/:envId
DELETE /api/projects/:id/env/:envId
POST   /api/projects/:id/env/copy
POST   /api/projects/:id/export
```

## Components to Create

- `src/components/projects/ProjectCard.tsx`
- `src/components/projects/ProjectForm.tsx`
- `src/components/projects/ProjectList.tsx`
- `src/components/projects/DeleteProjectDialog.tsx`
- `src/components/env/EnvVariableForm.tsx`
- `src/components/env/EnvVariableTable.tsx`
- `src/components/env/EnvVariableItem.tsx`
- `src/components/env/ExportMenu.tsx`
- `src/components/common/SearchBar.tsx`
- `src/components/common/FilterPanel.tsx`

## Pages

- `src/app/dashboard/page.tsx` (main dashboard)
- `src/app/dashboard/projects/page.tsx`
- `src/app/dashboard/projects/[id]/page.tsx` (project detail)
- `src/app/dashboard/projects/create/page.tsx`

## Validation Schemas (Zod)

- Project creation/update
- Env variable creation/update
- Search/filter inputs

## Success Criteria

- ✅ Can create/read/update/delete projects
- ✅ Can add/edit/delete env variables
- ✅ Values properly encrypted
- ✅ Copy functionality works (30sec clipboard clear)
- ✅ Export generates correct .env format
- ✅ Search and filter work correctly
- ✅ All inputs validated with Zod

## Time Estimate: 2-3 hours
