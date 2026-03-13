# Servamind: Figma Design Delta Tracking

> Generated 2026-02-26 from Figma file `M1lc0SCPzZ0y92BmUzNOeO` (Encoder V1 canvas)
> Compared against current codebase in `servamind-app/src/`

---

## Summary of Changes

The new Figma designs introduce a **major layout restructure**: the app now uses a **left sidebar + main content panel** pattern instead of the current centered single-column layout. The nav bar is simplified, the footer uses a blurred image mask, and the workflow stages (upload, file list, encoding, download) all live inside a white content card. Colors, fonts, and overall brand remain the same.

---

## 1. GLOBAL LAYOUT: Sidebar + Content Panel (NEW)

### Current Implementation
- `AppShell` wraps everything in `min-h-screen flex flex-col`
- `PageContainer` centers content at `max-w-5xl mx-auto`
- No sidebar; Encode/Decode toggle is in `PageHeader` as tab buttons

### Figma Design
- **Left sidebar** (184px wide) sits below nav, full height
  - Section label "DATA" (PT Mono, 12px, tracking 0.48px, `--serva-gray-300`)
  - Two nav items: "Encode" and "Decode" (each 32px tall, with icons)
  - Active item: `bg-light-200 (#eaeaea)`, `rounded-[4px]`
  - Inactive item: no background
  - Sidebar collapse icon at bottom
  - On Settings pages, section label changes to "SETTINGS" with items "Your profile" and "Billing" (no icons)
- **Main content panel**: white card (`bg-light-100`, `border-light-200`, `rounded-[8px]`) positioned to right of sidebar
  - Width: ~1246px (fills remaining space)
  - Has its own page title row at top

### Changes Required
| # | Task | Files Affected | Priority |
|---|------|---------------|----------|
| 1.1 | Create `Sidebar` component with DATA section (Encode/Decode with icons) | New: `components/composed/Sidebar.tsx` | HIGH |
| 1.2 | Create `SettingsSidebar` variant with SETTINGS section (Your profile/Billing, no icons) | Same file or variant prop | HIGH |
| 1.3 | Create `ContentPanel` wrapper component (white card, border, rounded-[8px]) | New: `components/layout/ContentPanel.tsx` | HIGH |
| 1.4 | Update `AppShell` to use sidebar + content panel layout | `components/layout/AppShell.tsx` | HIGH |
| 1.5 | Remove `PageContainer` centered layout (replaced by sidebar layout) | `components/layout/PageContainer.tsx` | HIGH |
| 1.6 | Remove Encode/Decode toggle tabs from `PageHeader` (sidebar handles this now) | `components/composed/PageHeader.tsx` | HIGH |
| 1.7 | Add sidebar collapse button with `sidebar-collapse` icon | Sidebar component | LOW |

---

## 2. NAVIGATION BAR (Nav_v2) ✅

### Figma Design
- Height: 54px, bg `--light-300`, px-24
- Right: Dashboard, Get Started, settings gear (20px), usage pill, avatar circle (32px)
- "Why .serva" link removed per latest design direction

### Status: COMPLETE
- Height 54px, bg-light-300, px-6
- "Why .serva" link and ExternalLinkIcon removed
- Settings icon reduced to 20px with mx-1 padding
- Dashboard (medium, gray-600) + Get Started (regular, gray-400) links
- Usage pill: bg-light-200, rounded-[4px], "Used X / Y" format
- Avatar: 32px circle, bg-serva-gray-100, shows initial

---

## 3. FOOTER

### Current Implementation (`Footer.tsx`)
- Text links: "Terms of Use | Privacy Policy"
- Company link
- Gray text with purple hover

### Figma Design
- Height: 85px
- Uses a **blurred/masked background image** (gradient cityscape/abstract image with mask)
- The footer appears to be purely decorative (image-based gradient at bottom)
- No visible text links in the Figma footer

### Changes Required
| # | Task | Files Affected | Priority |
|---|------|---------------|----------|
| 3.1 | Replace text footer with image-masked decorative footer | `components/composed/Footer.tsx` | MEDIUM |
| 3.2 | Source/create the gradient footer image asset | Asset needed | MEDIUM |

---

## 4. ENCODER PAGE - Empty/Upload State (Home - Base) ✅

### Current Implementation (`EncoderPage.tsx`, `UploadStageView.tsx`, `DropZone.tsx`)
- `PageHeader` with "Encode" title and Encode/Decode toggle tabs
- `InfoBanner` at top (dark gray, dismissible)
- `DropZone`: 440px height, holographic animated border (conic gradient), drag-drop
  - Shows cloud-upload icon, bold heading, description, file size limit text
  - Rounded-[52px] corners
- Below DropZone: 3 `FeatureCard` components (icon, title, description)

### Figma Design
- Page title "Encode" in content panel header (20px, semibold, `--serva-gray-600`)
- **No InfoBanner** visible
- **DropZone redesigned**:
  - Dashed border (`border-dashed`, `border-serva-gray-100`)
  - Rounded-[16px] (not 52px)
  - Cloud-upload icon inside a white box with border (`bg-white`, `border-light-200`, `rounded-[8px]`, `p-[12px]`)
  - Heading: "Turn your data into reusable .serva files" (20px semibold)
  - Description text: "Upload once and securely reuse..." (14px regular, `--serva-gray-400`)
  - File limit text: "Up to 100 MB - txt, csv, json, pdf, png, jpg, mp4" (12px)
  - **Purple CTA button**: "Try Encoder" (18px medium, `bg-core-purple`, `rounded-[500px]` pill, `px-28 py-12`)
  - No holographic animated border in empty state
- Below DropZone: "Then use the same .serva files across every model" section
  - Heading (20px semibold)
  - Description (14px regular)
  - **Comparison diagram**: "Without Servamind" vs "With Servamind" flow showing Dataset -> Preprocess -> Train vs Dataset -> .serva -> Train

### Status: COMPLETE

---

## 5. ENCODER PAGE - Files Ready State (Ready to Encode) ✅

### Status: COMPLETE

---

## 6. ENCODER PAGE - Encoding In Progress ✅

### Status: COMPLETE

---

## 7. ENCODER PAGE - Encoding Complete (Finished Encoding) ✅

### Status: COMPLETE

---

## 8. PRIVATE KEY MODAL (Decode Flow)

### Status: Superseded by §14

---

## 9. SETTINGS - PROFILE PAGE ✅

### Current Implementation (`SettingsPage.tsx`)
- Two-section layout: sidebar nav (General > Your Profile, Settings > Billing) + main content
- Profile tab: Name, Email (disabled), Phone inputs with Save button

### Figma Design
- Uses the global sidebar with "SETTINGS" section label, "Your profile" and "Billing" items
- Main content panel with title "Your profile" (20px semibold)
- Form fields:
  - **Name**: label (14px medium) + description "The name associated with this account" (12px, `--serva-gray-400`) + input (44px height, `border-light-200`, `rounded-[8px]`, `pl-16`)
  - **Email address**: label + description + input (44px, **disabled**: `bg-light-300`, muted text `--serva-gray-200`)
  - **No Phone field** in Figma
  - **Save button**: purple (`bg-core-purple`), 36px height, `rounded-[8px]`, "Save" text (semibold)
- Fields are 394px wide, positioned at ~10% left margin in content area
- Gap between field groups: 32px
- Gap between label group and input: 16px
- Gap between label and description: 8px

### Status: COMPLETE
- Profile form with Name + Email (disabled) + Save button
- Form positioned with `ml-[10%]` to match Figma layout
- Heading spacing updated (`mb-16`) to match design
- Content panel padding updated (`py-10 px-16`)

---

## 10. SETTINGS - BILLING PAGE (REDESIGNED) ✅

### Current Implementation
- Plan type display, Storage usage with progress bar
- Bandwidth pricing card
- Action buttons (Add payment, View usage)
- 5-card grid (Payment methods, Billing history, Preferences, Usage limits, Pricing)

### Figma Design
- Title: "Billing" (20px semibold)
- **Tab bar** below title: "Overview" (active, underlined) | "Payment methods" (inactive)
- **Monthly usage section** with progress bar and reset date
- **Three billing states** based on plan/payment status

### Status: COMPLETE
- Tab bar with Overview/Payment methods
- Monthly usage display with holographic progress bar
- Three billing states implemented:
  1. **Under limit, no payment method** (node 1056:791): Upsell card with pricing details + "Add payment method" button
  2. **Under limit, has payment method** (node 1056:1198): Extended description + standalone "Add payment method" button
  3. **Over limit** (node 1056:996): Overage display (base/base + overage), card with pricing info + estimated charge
- Content positioned at `ml-[10%]` with `max-w-[805px]` to match Figma
- TODO: Wire `hasPaymentMethod` to real payment data (currently placeholder)

---

## 11. BUTTON STYLING UPDATES ✅

### Status: COMPLETE
All button styles already match the Figma spec in `components/ui/Button.tsx`:
- Primary: `bg-core-purple`, `text-light-200`, `rounded-[8px]`, 36px height (md), `font-semibold`
- Secondary: `bg-white`, `border-light-200`, `rounded-[8px]`, `text-serva-gray-600`
- Sizes: sm (32px), md (36px), lg (44px) — all `rounded-[8px]`

---

## 12. TYPOGRAPHY & SPACING REFINEMENTS ✅

### Status: COMPLETE
Typography tokens are set in `globals.css` via `@theme` directive:
- Font families: DM Sans (sans), PT Mono (mono), Instrument Sans (display)
- Page titles verified: 20px semibold, `leading-[1.1]`, `tracking-[-0.6px]` (used in onboarding, settings, encoder)
- Body text: 14px regular, `leading-[1.4]`, `tracking-[-0.42px]` (used in onboarding screens)
- Sidebar labels: PT Mono, 12px, `tracking-[0.48px]`

---

## 13. COLOR TOKEN ADDITIONS ✅

### Status: COMPLETE
All tokens already exist in `styles/globals.css`:
- `--color-core-purple: #630066` — primary buttons
- `--color-serva-gray-200: #a59ca6` — muted text
- `--color-holo-green: #c2ea53` — holographic gradient (available for encoding border)
- Also added: `.text-holo-gradient` utility class for holographic text effect (onboarding "on us!" text)

---

## 14. PRIVATE KEY MODAL - FULL MULTI-STEP FLOW (EXPANDED) ~✅

### Status: MOSTLY COMPLETE
Multi-step private key modal implemented in `components/composed/PrivateKeyModal.tsx`:
- 7 dialog states: Empty (encode), Key Entered, Key Copied, Confirmation, Double Confirmation, Empty (decode), Key Entered (decode)
- Generate/Copy button inside input, "Copied, keep it safe!" green feedback
- Confirmation steps: "Have you saved your private key?" → "Are you sureee you saved it?"
- Dialog width ~419px, `rounded-[16px]`, proper shadow
- Lock icon removed, purple buttons with disabled state
- May need minor polish/fine-tuning against Figma

---

## 15. AVATAR POPOVER UPDATES ✅

### Figma Design (node 1095:2913)
- Compact popover (188px wide) with name, email, divider, menu items
- Menu: "Your profile", "Visit our website", "Talk to our team", "Sign out" (lighter color)
- No avatar circle, no quota section in popover

### Status: COMPLETE
- Redesigned to match Figma: compact card with rounded-lg, subtle shadow
- Name (from email prefix) + email in header
- Four menu items with hover states (rounded, bg-light-200/50)
- "Sign out" uses lighter text-serva-gray-400
- Quota section removed from popover (still in nav pill)

---

## 16. ONBOARDING FLOW ✅

### Status: COMPLETE
Full 7-screen onboarding flow implemented. Old `OnboardingModal.tsx` removed.

**Architecture:**
- State machine hook: `hooks/behavior/useOnboardingFlow.ts` (`login → check-email → welcome → tutorial:0-3 → done`)
- Container: `containers/OnboardingContainer.tsx` (wires auth + flow + email API)
- Components in `components/composed/onboarding/`:
  - `OnboardingShell.tsx` — portal + frosted glass backdrop (419px, 16px radius, Figma shadow)
  - `LoginScreen.tsx` — logo + dark BETA badge, updated headline, email input with fade-in arrow submit, lowercase "or" divider, Google OAuth (no Apple), Privacy Policy only
  - `CheckEmailScreen.tsx` — logo + BETA badge, "Check your email to continue", gray box with email + mail SVG, "Use another email" underlined, privacy footer, debug mock verify button
  - `WelcomeScreen.tsx` — Servamind icon, "Welcome to Servamind", description, dark info box with holo gradient "on us!", small purple Continue button
  - `TutorialScreen.tsx` — 4 substeps with progress dots, video import from `src/assets/videos/`, placeholder icons for non-video steps, Next/Skip/Start encoding
  - `OnboardingFlow.tsx` — screen switcher
- Mock email endpoints: `POST /auth/email/send-link`, `POST /auth/email/verify` (MSW handlers + fixtures)
- Auth: `emailToken` added to `SignInCredentials`, Google adapter handles email token branch
- `localStorage` flag `serva_onboarding_complete` persists completion
- Mock adapter no longer auto-authenticates on init (allows testing full flow)

---

## 17. GET STARTED PAGE (NEW PAGE)

### Current Implementation
- No "Get Started" page exists in the current app
- "Get Started" is just a nav link

### Figma Design (from reference screenshot)
The Get Started screenshot shows a **documentation/tutorial page** with:
- Same sidebar layout, but sidebar items are documentation sections:
  - "Overview" (active/highlighted)
  - "Install SDK"
  - "Authenticate"
  - "Load .serva files"
  - "Train your model"
  - "What changes?"
  - "Advanced configuration"
  - "Troubleshooting"
- Main content area with:
  - "Train your model with .serva files" heading
  - Description paragraphs
  - "Overview" subheading
  - Code blocks with "Copy" button (e.g., `npm install @servamind/sdk`)
  - Flow diagram: Raw Data -> .serva -> Model Training

### Changes Required
| # | Task | Files Affected | Priority |
|---|------|---------------|----------|
| 17.1 | Create `GetStartedPage` with documentation layout | New: `pages/GetStartedPage.tsx` | MEDIUM |
| 17.2 | Create documentation sidebar variant with section navigation | Sidebar variant or new component | MEDIUM |
| 17.3 | Add route for `/get-started` | `routes.tsx` | MEDIUM |
| 17.4 | Create code block component with Copy button | New UI component | MEDIUM |
| 17.5 | Add documentation content (Overview, Install SDK, etc.) | Page content | LOW |

---

## 18. COMPONENTS TO REMOVE / DEPRECATE ✅

### Status: COMPLETE
Validated usage and removed unused components:

| Component | Status | Notes |
|-----------|--------|-------|
| `InfoBanner` | **REMOVED** | No imports found anywhere; deleted file + barrel export |
| `FeatureCard` | **REMOVED** | No imports found anywhere; deleted file + barrel export |
| `PageHeader` | **REMOVED** | No imports found anywhere (sidebar handles navigation); deleted file + barrel export |
| `OnboardingModal` | **REMOVED** | Replaced by `onboarding/` components + `OnboardingContainer`; deleted file + barrel export |
| `WorkflowCard` | **KEPT** | Still actively used in `containers/WorkflowContainer.tsx` |
| Old billing card grid | **N/A** | Already replaced in previous billing redesign work |

---

## Implementation Order (Recommended)

### Phase 1: Layout Foundation ✅
1. ~~Add color tokens (§13)~~ — DONE
2. ~~Create Sidebar component (§1.1, 1.2)~~ — DONE
3. ~~Create ContentPanel component (§1.3)~~ — DONE
4. ~~Update AppShell for sidebar layout (§1.4, 1.5)~~ — DONE
5. ~~Update NavBar (§2)~~ — DONE
6. Update Footer (§3) — PENDING
7. ~~Update Button component (§11)~~ — DONE

### Phase 2: Encoder Page - Upload State ✅
8. ~~Redesign DropZone (§4)~~ — DONE
9. ~~Remove InfoBanner (§4.1)~~ — DONE (component removed in §18)
10. ~~Create comparison diagram section (§4.7-4.8)~~ — DONE
11. ~~Remove PageHeader toggle (§1.6)~~ — DONE (component removed in §18)

### Phase 3: Encoder Page - File List & Encoding ✅
12. ~~Redesign FileTable with new row layout (§5)~~ — DONE
13. ~~Update FileTableActionBar (§5.5-5.7)~~ — DONE
14. ~~Create encoding-in-progress file row states (§6)~~ — DONE

### Phase 4: Encoder Page - Complete State ✅
15. ~~Redesign DownloadStageView (§7)~~ — DONE

### Phase 5: Settings Pages ✅
16. ~~Update Profile page (§9)~~ — DONE
17. ~~Rebuild Billing page (§10)~~ — DONE

### Phase 6: Modals & Dialogs ~✅
18. ~~Refactor PrivateKeyModal (§14)~~ — MOSTLY DONE (may need minor polish)
19. ~~Update Avatar Popover (§15)~~ — DONE

### Phase 7: Onboarding Flow ✅
20. ~~Refactor onboarding into multi-step wizard (§16)~~ — DONE

### Phase 8: New Pages & Cleanup
21. Create Get Started documentation page (§17)
22. ~~Typography fine-tuning (§12)~~ — DONE
23. ~~Remove deprecated components (§18)~~ — DONE

---

## Notes from Designer (Found in Figma Annotations)

- "NEED: Rive that has the rays moving inward when I hover or when i drag over to drop..." (DropZone animation)
- "some kinda rainbow animated border to show progress" (encoding progress)
- "need gray tile to be more exciting but not... bigger" (download result cards)
- "MAybe they collapse and only show like 3 with 'Show all'???" (file list when many files)
- "more interesting visuals here for whats next..." (post-encoding section)
- "This def modal... but maybe rest of onboarding not a modal????" (onboarding flow uncertainty)
- "can probably include link to Profile... Get rid of Pricing... Change Free Beta to Monthly Usage with a beta tag somewhere..." (nav popover changes)
- "need monthly usage gauge for when ive gone over..." (billing over-limit state)
