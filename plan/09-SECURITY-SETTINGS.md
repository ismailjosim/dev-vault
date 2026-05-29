# Step 9: Security, Settings & UI/UX Polish

## Objective

Implement security features, user settings, and polish the user interface.

## 9.1 Security Features

### Master Password / Session Authentication

- [ ] Master password verification on app start
- [ ] Optional re-authentication for sensitive operations:
  - Viewing secret values
  - Copying values
  - Exporting .env
  - Deleting projects
- [ ] Session-based lockout
- [ ] Biometric unlock support (optional)

### Secret Value Protection

- [ ] Values hidden by default (masked with *)
- [ ] Reveal button (eye icon) with click-to-show
- [ ] Auto-hide after 30 seconds of viewing
- [ ] Log viewing events (optional)
- [ ] Notification when secrets are viewed

### Clipboard Management

- [ ] Auto-clear clipboard after 30 seconds
- [ ] Clear clipboard on logout
- [ ] Show toast: "Copied! Clipboard will clear in 30s"
- [ ] Countdown timer display (optional)

### Encryption Implementation

- [ ] All secrets encrypted in database
- [ ] AES-256 encryption for sensitive data
- [ ] Client-side encryption before sending to server
- [ ] Secure key derivation from password
- [ ] Never log or expose encrypted keys

### Security Best Practices

- [ ] HTTPS only (enforce in production)
- [ ] Secure cookies (HttpOnly, Secure, SameSite)
- [ ] CSRF protection
- [ ] Rate limiting on API endpoints
- [ ] SQL injection prevention (Mongoose)
- [ ] XSS prevention (sanitization)
- [ ] No secrets in browser console
- [ ] No secrets in error messages

### Security Components

- `src/components/security/SecretViewer.tsx` (reveal/hide)
- `src/components/security/MasterPasswordModal.tsx`
- `src/components/security/SecureLogout.tsx`

### Security Utilities

- `src/utils/security.ts`:
  - `generateMasterKey(password)`
  - `encryptSecret(secret, key)`
  - `decryptSecret(encrypted, key)`
  - `maskSecretValue(value)`
  - `clearClipboard()`

## 9.2 User Settings

### Account Settings

- [ ] Change password
- [ ] Update email (with verification)
- [ ] Update name/profile
- [ ] View account creation date
- [ ] Delete account (with confirmation)

### Security Settings

- [ ] Auto-lock timeout (5, 10, 15, 30 min, never)
- [ ] Master password change
- [ ] Session management (view active sessions)
- [ ] Two-factor authentication (optional, future)

### Preferences

- [ ] Theme: Light / Dark / System
- [ ] Default export format (.env, .env.local, etc)
- [ ] Default copy format (VALUE, KEY=VALUE, etc)
- [ ] Language (English, etc)
- [ ] Show/hide sensitive values by default
- [ ] Clipboard clear timeout (15s, 30s, 60s)
- [ ] Project sort order (recent, alphabetical, pinned)

### Notifications

- [ ] Email notifications:
  - [ ] Expiring credentials alert
  - [ ] New login alert
  - [ ] Account activity summary
- [ ] In-app notifications
- [ ] Disable all notifications

### Pages

- `src/app/dashboard/settings/account/page.tsx`
- `src/app/dashboard/settings/security/page.tsx`
- `src/app/dashboard/settings/preferences/page.tsx`

### Components

- `src/components/settings/ChangePasswordForm.tsx`
- `src/components/settings/AutoLockSettings.tsx`
- `src/components/settings/ThemeToggle.tsx`
- `src/components/settings/NotificationPreferences.tsx`

### Database Schema Update (User)

```javascript
{
  // ... existing fields
  settings: {
    theme: String,
    autoLockTimeout: Number,
    defaultExportFormat: String,
    defaultCopyFormat: String,
    language: String,
    showSensitiveByDefault: Boolean,
    clipboardClearTimeout: Number,
    projectSortOrder: String,
    emailNotifications: {
      expiringCredentials: Boolean,
      loginAlerts: Boolean,
      activitySummary: Boolean
    }
  }
}
```

## 9.3 UI/UX Polish

### Dashboard Redesign

- [ ] Hero section with quick stats:
  - Total projects
  - Total env variables
  - Expiring soon count
  - Storage used (if applicable)
- [ ] Recent projects widget
- [ ] Quick actions (Create Project, Import .env, etc)
- [ ] Visual empty state with onboarding

### Navigation & Layout

- [ ] Sidebar navigation with icons
- [ ] Breadcrumb navigation
- [ ] Mobile-responsive sidebar (drawer)
- [ ] Quick search in navbar
- [ ] User menu dropdown
- [ ] Notifications bell icon
- [ ] Settings gear icon

### Visual Enhancements

- [ ] Consistent spacing and padding
- [ ] Card-based layout for projects
- [ ] Smooth transitions and animations
- [ ] Loading states (skeleton loaders)
- [ ] Error state displays
- [ ] Success toast notifications
- [ ] Confirmation dialogs for destructive actions

### Accessibility

- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation support
- [ ] Screen reader support
- [ ] Color contrast (4.5:1 minimum)
- [ ] Focus indicators
- [ ] ARIA labels and descriptions

### Components

- `src/components/layout/Sidebar.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/DashboardLayout.tsx`
- `src/components/common/Toast.tsx`
- `src/components/common/SkeletonLoader.tsx`
- `src/components/common/ConfirmDialog.tsx`
- `src/components/common/EmptyState.tsx`

### Animations

```bash
pnpm add framer-motion
```

## 9.4 Onboarding Flow

### First-Time User Experience

- [ ] Welcome screen
- [ ] Feature overview slides
- [ ] Create first project
- [ ] Add first env variable
- [ ] Explore templates
- [ ] Complete profile

### Components

- `src/components/onboarding/WelcomeScreen.tsx`
- `src/components/onboarding/FeatureTour.tsx`
- `src/components/onboarding/OnboardingModal.tsx`

## 9.5 Error Handling & Logging

### Error Boundaries

- [ ] Global error boundary
- [ ] Component-level error boundaries
- [ ] User-friendly error messages
- [ ] Error reporting (optional)

### Logging

- [ ] Client-side error logging
- [ ] Server-side error logging
- [ ] Request/response logging (development)
- [ ] No sensitive data in logs

### Components

- `src/components/common/ErrorBoundary.tsx`

## Success Criteria

- ✅ All secrets properly encrypted and protected
- ✅ Clipboard clears after 30 seconds
- ✅ Settings save and persist
- ✅ UI is responsive and accessible
- ✅ Onboarding guides new users
- ✅ Error messages are helpful
- ✅ Dark mode works correctly
- ✅ No sensitive data exposed

## Time Estimate: 2.5-3 hours
