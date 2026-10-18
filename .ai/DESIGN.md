# WashPass — Design System & UI Tokens (DESIGN.md)

Spesifikasi sistem desain, token CSS, tipografi, komponen interaktif, palet warna, dan standar gerak (motion) WashPass. Diperbarui mengacu pada prinsip *Modern Clean & Crisp Aqua* serta *Emil Kowalski Motion Physics*.

## 1. Color Palette (Tokens)

Implementasi aktif pada `src/css/variables.css`:

```css
:root {
  /* Brand Primary (Clean Modern Aqua & Sky) */
  --color-primary: #0284C7;         /* Primary brand color, CTA button, focus indicators */
  --color-primary-dark: #0369A1;    /* Hover state button primary, dark accents */
  --color-primary-light: #38BDF8;   /* Active border, ring focus, subtle highlights */
  --color-primary-tint: #E0F2FE;    /* Soft wash badge & selected card backgrounds */

  /* Accent (Warm Amber / Trust Gold) */
  --color-accent: #F59E0B;          /* Rating stars, highlight tags, promo banners */
  --color-accent-dark: #D97706;     /* Accent hover & active state */
  --color-accent-light: #FEF3C7;    /* Accent background tint */

  /* Neutral & Surfaces (Crisp Clean Slate) */
  --color-bg: #F8FAFC;              /* App background (cool clean slate white) */
  --color-surface: #FFFFFF;         /* Card background, dialog modal, inputs */
  --color-text: #0F172A;            /* Headings & primary body copy (WCAG AAA contrast) */
  --color-text-secondary: #475569;  /* Subtitles, labels, descriptions */
  --color-text-muted: #94A3B8;      /* Placeholder text, hints, inactive icons */
  --color-border: #E2E8F0;          /* Card borders, structural dividers */
  --color-border-subtle: #F1F5F9;   /* Subtle inner separators */

  /* Feedback & Status */
  --color-success: #10B981;         /* Order done, valid input check */
  --color-success-tint: #ECFDF5;
  --color-error: #EF4444;           /* Validation error, danger buttons */
  --color-error-tint: #FEF2F2;
}
```

## 2. Typography Scale

- **Heading Font**: `'Plus Jakarta Sans', sans-serif` (Weights: 600, 700, 800)
- **Body Font**: `'Inter', sans-serif` (Weights: 400, 500, 600)

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
  - `--radius-2xl` (24px): Prominent hero containers & bottom sheets.
  - `--radius-full` (9999px): Pill badges & circular icons.

## 4. Elevation & Shadows

```css
--shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.05);
--shadow-md: 0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04);
--shadow-lg: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03);
--shadow-xl: 0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.03);
```

## 5. Motion & Physics Tokens

Mengikuti standar `animate` (Emil Kowalski animation philosophy):
- Asymmetric timing: Exit selalu lebih cepat daripada Entrance.
- Easing: `--ease-out` untuk masuk (`cubic-bezier(0.16, 1, 0.3, 1)`), `--ease-in-out` untuk morph/state shift.
- Wajib `prefers-reduced-motion` override (durasi $0.01\text{ms}$).

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 400ms;
```

## 6. Mobile-First Interaction Patterns

- **Touch Targets**: Minimum $44 \times 44\text{ px}$ (`--touch-target-min`).
- **Tap Feedback**: Haptic visual `transform: scale(0.97)` berdurasi `100ms` pada `.btn` dan selectable cards.
- **Mobile Bottom Bar / Sticky CTA**: Pada layar `< 768px`, tombol konfirmasi atau order step menempel di bawah (safe-area compliant).
- **Demo Badge** (`.demo-badge`): label kecil di navbar/header halaman (order, track, admin) penanda mode live demo — radius pill, background `#FEF3C7`, border `#FCD34D`, text `#92400E`, uppercase bold.
- **Cards (Material & Wash Type)**:
  - Default: Border `--color-border`, background `--color-surface`.
  - Selected: Border `--color-primary` (2px), box-shadow `--shadow-md`, background `--color-primary-tint`.
- **Glassmorphism Overlay**:
  - `background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px);` digunakan pada navbar sticky dan hero trust badges.
- **Scroll & Stagger Effects**:
  - Scroll progress bar di puncak viewport (`position: fixed; top: 0; height: 3px; background: var(--color-primary)`).
  - Back-to-top floating button: muncul saat `window.scrollY > 350`, smooth translate & fade.
  - Scroll reveal: `.reveal` transisi `opacity` & `translateY(20px)` $\rightarrow$ `.reveal-visible`.
