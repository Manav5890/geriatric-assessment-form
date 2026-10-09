# Geriatric Care Assessment Form

A single-page Geriatric Care Assessment application built with **React 19**, **TypeScript**, **Mantine v9**, and **Zod 4**.

Visiting nurses use this form during home visits to record clinical data for elderly patients (aged 60+).

---

## 🌐 Live Deployment

- **Deployed Application URL**: [https://geriatric-assessment-form-nro7.vercel.app/](https://geriatric-assessment-form-nro7.vercel.app/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.x
- Yarn (Yarn 4 / Corepack enabled)

### Installation & Local Setup

```bash
# Enable Corepack if needed
corepack enable

# Install dependencies
yarn install

# Start development server
yarn dev
```

The application will be available at `http://localhost:5173`.

---

## 🧪 Testing & Verification

Run the full verification pipeline (Typecheck, Oxlint, Stylelint, Vitest, and Production Build):

```bash
yarn test
```

To run Vitest unit and component tests individually:

```bash
yarn vitest
```

---

## 🛠️ Architecture & Key Technical Decisions

### 1. Schema & Validation Wiring (`src/features/assessment/schema.ts`)
- Configured using **Zod 4** (`z.iso.date()`, `{ error: '...' }`).
- Directly integrated into Mantine Form via `schemaResolver(assessmentSchema)` from `@mantine/form`.
- **Zero duplicated rules**: Rules are declared strictly within `assessmentSchema` with cross-field `.refine()` validations.
- **Cross-Field Rules**:
  - **Patient Age (>= 60)**: `dateOfBirth <= minus60Years(assessmentDate)` checked against `assessmentDate` (not today) to accommodate backdated visits.
  - **Follow-up Date**: `followUpDate > assessmentDate`.
  - **Polypharmacy Warning**: `medicationCount >= 5` forces `pharmacistReviewRequested = true`.
- **Guard logic**: Blank date and medication inputs are short-circuited in refinements so missing fields trigger only "required" validation messages rather than stacked errors.

### 2. Feature Structure
```
src/
├── features/
│   └── assessment/
│       ├── schema.ts                   # Zod schema definition & inferred Assessment type
│       ├── utils.ts                    # Dynamic MOBILITY label formatting & initial/sample fixtures
│       ├── components/
│       │   └── AssessmentForm.tsx      # Main assessment form wrapped in Mantine Paper/Container
│       └── __tests__/
│           ├── schema.test.ts          # Vitest test for 60-year DOB boundary
│           └── form.test.tsx           # RTL test for sample patient loading & submission
├── pages/
│   └── Home.page.tsx                   # Main page entry point
└── App.tsx                             # MantineProvider setup & global CSS imports
```

### 3. Dynamic Mobility Dropdown
- Options are generated dynamically from the `MOBILITY` tuple.
- `formatMobilityLabel` transforms string tokens (e.g. `bedbound` → `Bedbound`, `home_visit` → `Home Visit`).
- Adding items to the `MOBILITY` array automatically updates the UI dropdown without modifying component code.

### 4. Input Typing Strategy
- Types are inferred directly from `z.infer<typeof assessmentSchema>` (`Assessment`).
- `INITIAL_VALUES` uses empty string defaults for missing text/date/number fields while preserving structural typing without creating a duplicated secondary interface.

---

## ⏱️ Time Spent & Status

- **Total Time Spent**: < 2 hours (~1.5 hours)
- **Status**: 100% complete. All requirements met.
