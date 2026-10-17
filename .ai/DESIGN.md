# WashPass — Design System & UI Tokens (DESIGN.md)

Dokumentasi spesifikasi desain, token CSS, tipografi, komponen interaktif, dan pedoman UI visual yang saat ini terimplementasi di WashPass.

## 1. Color Palette (Tokens)

Implementasi aktif pada `src/css/variables.css`:

```css
:root {
  /* Brand Primary (Teal) */
  --color-primary: #0D9488;         /* Primary brand color, CTA button, active elements */
  --color-primary-dark: #0F766E;    /* Hover state button primary, dark accent */
  --color-primary-light: #14B8A6;   /* Active border, subtle highlight */

  /* Accent (Amber/Gold) */
  --color-accent: #F59E0B;          /* Rating stars, badge highlight */
  --color-accent-dark: #D97706;     /* Accent hover */

  /* Neutral & Surfaces */
  --color-bg: #FAFAF9;              /* App background (soft warm gray) */
  --color-surface: #FFFFFF;         /* Card background, dialog modal */
  --color-text: #1C1917;            /* Headings & primary body copy */
  --color-text-secondary: #78716C;  /* Subtitles, labels, secondary info */
  --color-text-muted: #A8A29E;      /* Placeholder text, disabled hints */
  --color-border: #E7E5E4;          /* Card borders, table dividers */

  /* Status Colors */
  --color-success: #22C55E;         /* Order done, valid input */
  --color-error: #EF4444;           /* Validation error, danger buttons */
}
```

## 2. Typography Scale

- **Heading Font**: `'Plus Jakarta Sans', sans-serif` (Google Fonts, weights: 600, 700, 800)
- **Body Font**: `'Inter', sans-serif` (Google Fonts, weights: 400, 500, 600)

| Token | Ukuran | Penggunaan |
|---|---|---|
| `--text-xs` | `0.75rem` (12px) | Badge kecil, disclaimer legal, caption |
| `--text-sm` | `0.875rem` (14px) | Form labels, detail footer, sub-text |
| `--text-base` | `1rem` (16px) | Body copy default, input text |
| `--text-lg` | `1.125rem` (18px) | Card title, highlight text |
| `--text-xl` | `1.25rem` (20px) | Subheadings, section titles kecil |
| `--text-2xl` | `1.5rem` (24px) | Modal headings, feature titles |
| `--text-3xl` | `1.875rem` (30px) | Section headings di tablet/desktop |
| `--text-4xl` | `2.25rem` (36px) | Section headings di desktop |
| `--text-5xl` | `3rem` (48px) | Hero main heading |

## 3. Spacing & Radius System

- **Spacing**: Scale 4-point linear:
  - `--space-1` (4px), `--space-2` (8px), `--space-3` (12px), `--space-4` (16px), `--space-6` (24px), `--space-8` (32px), `--space-10` (40px), `--space-12` (48px), `--space-16` (64px), `--space-20` (80px), `--space-24` (96px).
- **Border Radius**:
  - `--radius-sm` (6px): Tag badge & small inputs.
  - `--radius-md` (8px): Form input fields, buttons.
  - `--radius-lg` (12px): Standard cards & tables.
  - `--radius-xl` (16px): Featured cards & modals.
  - `--radius-2xl` (24px): Prominent hero containers.
  - `--radius-full` (9999px): Pill badges & circular icons.

## 4. Elevation & Shadows

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);          /* Subtle separation */
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);      /* Card elevation */
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);    /* Modals & floating action */
--shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1);    /* High elevation elements */
```

## 5. UI Components & Interaction Patterns

- **Buttons**:
  - `.btn-primary`: Background `--color-primary`, text white, hover `--color-primary-dark`, active scale `0.98`.
  - `.btn-secondary`: Light surface border with dark text.
  - `.btn-outline`: Transparent background with border `--color-primary`.
  - `.btn-ghost`: Subtle hover effect without border.
  - Touch target minimal: $44 \times 44\text{ px}$.
- **Cards (Material & Wash Type)**:
  - Default: Border `--color-border`, background `--color-surface`.
  - Selected: Border `--color-primary` (2px), box-shadow `--shadow-md`, background `--color-primary` tint.
- **Glassmorphism Overlay**:
  - `background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px);` digunakan pada floating badge Hero.
- **Responsiveness**:
  - Mobile-first: Breakpoints `<768px` (Mobile), `768px-1024px` (Tablet), `>1024px` (Desktop).
  - Max container width: `1200px`.
