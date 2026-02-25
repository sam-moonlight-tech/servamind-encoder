# Open Issues — Serva Encoder API Rewiring

Tracking document for unresolved questions, bugs, and follow-up work after the API rewiring from nebuli-amplify to Serva Encoder API v1.1.

---

## Backend Questions — RESOLVED

### B1. API Key Lifecycle — RESOLVED
- Users can have multiple active API keys
- `GET /auth/api-keys` now exists (lists active keys)
- Explicit management — user clicks "Generate API Key" in a dashboard UI
- Keys survive sign-out (used independently by CLI)
- **Web UI uses session token for encode**, API keys are for CLI/programmatic use

### B2. Google OAuth Token Type — NEEDS VERIFICATION
`useGoogleLogin` (implicit flow) returns an `access_token`. Backend needs to confirm this is what `/auth/google/callback` expects vs a Google ID token (credential JWT). If they expect an ID token, we switch to the credential-based flow.

---

## Blocked — Waiting on Deployment

### X1. API Not Reachable
**Status:** Waiting on backend team

`api.servaencoder.com` does not resolve (no DNS record). Backend team confirmed they're still working on deployment. Once live, they'll share the base URL. Update `VITE_API_BASE_URL` in `.env` when received.

---

## Bugs / Broken Flows

### C1. Encode Error Handling Missing — FIXED
Added `onError` to the mutation in `DropZoneContainer` — resets uploading state and transitions to error stage.

### C2. "Encoding" Stage is Dead Code (Happy Path)
**Status:** Not started

The encode API is atomic, so `DropZoneContainer` transitions directly from "upload" to "download". The `ProcessingContainer` / "encoding" stage is never shown.

**Fix:** Show the "encoding" stage as a loading state while the encode request is in-flight. Transition to "download" on success, "error" on failure.

### C3. Sign-Out Destroys API Key — FIXED
Keys now survive sign-out. They persist in localStorage independently.

---

## UI / UX Gaps

### D1. Onboarding Modal Email Field is Orphaned
**Status:** Not started

The email input currently passes the email as `googleToken` to `signIn()`. The new API only supports Google OAuth — there's no email/password endpoint.

**Options:**
- Remove the email field entirely (Google-only sign-in)
- Repurpose for waitlist/beta signup (would need a new endpoint)

### D2. Apple Sign-In is a No-Op
**Status:** Not started

The "Continue with Apple" button calls `signIn()` with no credentials. No Apple auth adapter exists.

**Options:**
- Hide the button until Apple sign-in is supported
- Implement Apple sign-in (needs Sign in with Apple JS SDK + backend endpoint)

### D3. API Key Management Dashboard
**Status:** Not started

Backend confirmed explicit key management. Need a settings/dashboard page where users can:
- View existing API keys (`GET /auth/api-keys` — key_id + key_prefix)
- Generate new keys (`POST /auth/api-keys`)
- Revoke keys (`DELETE /auth/api-keys/{key_id}`)

`AuthContext` already has `createApiKey`/`revokeApiKey` wired up. Need the UI.

### D4. Stats/Usage Hooks Are Unused
**Status:** Not started

`usePublicStats`, `useExtensionStats`, `useUsage`, and health hooks exist but no component consumes them. Need dashboard/stats UI.

---

## Testing

### E1. New Service/Hook Tests Needed
**Status:** Not started

No test coverage for:
- `auth.service.ts`, `encoder.service.ts`, `stats.service.ts`, `health.service.ts`
- `useEncode`, `usePublicStats`, `useExtensionStats`, `useUsage`, `useHealth`
- Google auth adapter
- AuthContext API key management
