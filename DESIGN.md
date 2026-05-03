---
name: Shahiduzzaman Bipul Portfolio
description: Crayon-crafted portfolio and CMS with calm trust, playful identity, and confident execution.
colors:
  paper: "#f4faf9"
  paper-shadow: "#dceeec"
  ink: "#2e3d3a"
  ink-soft: "#506b67"
  yellow: "#fde98a"
  mint: "#aee4d6"
  peach: "#ffc8b8"
  sky: "#a9d4ec"
  pink: "#f4c5cf"
  lilac: "#c8d4ec"
typography:
  display:
    fontFamily: "\"Caveat\", cursive"
    fontSize: "clamp(3rem, 15vw, 6.75rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "\"Nunito\", system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0.01em"
  hand:
    fontFamily: "\"Patrick Hand\", cursive"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  label:
    fontFamily: "\"Patrick Hand\", cursive"
    fontSize: "0.98rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  sm: "0.875rem"
  md: "1.05rem"
  lg: "1.6rem"
  xl: "2rem"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.hand}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.5rem"
    height: "2.75rem"
  button-ghost:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.hand}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.5rem"
    height: "2.75rem"
  nav-shell:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.75rem 0.75rem"
  card-surface:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "1.25rem 1.25rem"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "0.95rem"
    padding: "0.75rem 1rem"
    height: "3rem"
---

# Design System: Shahiduzzaman Bipul Portfolio

## 1. Overview

**Creative North Star: "The Playful Proof of Work"**

This system treats the portfolio as evidence with personality. It should feel like a well-kept sketchbook brought to a serious meeting: warm, memorable, and immediately human, but still precise enough to earn trust from recruiters and startup founders scanning quickly for capability. The crayon surface language is not childish decoration, it is the signature that turns ordinary portfolio content into a recognizable identity.

The visual philosophy is calm and trusted first, expressive second. Soft paper backgrounds, tinted neutrals, and dark ink anchors create credibility. Around that stable base, playful accents, hand-drawn typography, scribble strokes, and offset shadows make the work feel crafted rather than generated. The system should feel confident, not corporate, creative, not chaotic.

This system explicitly rejects template-like sameness, generic developer-portfolio tropes, and loud visual noise. It should not drift into glossy SaaS polish, empty editorial affectation, or overstimulated brand theater. The public site can be expressive, but every expressive move should still strengthen comprehension and trust.

**Key Characteristics:**
- Calm, paper-like base with soft color confidence
- Hand-drawn typography used as identity, not as novelty
- Tactile surfaces with structural offset shadows
- Expressive motion that begins immediately and stays lightweight
- Clear separation between playful public brand surfaces and quieter admin utility surfaces

## 2. Colors

The palette is a restrained full-palette system: tinted neutrals do the trust-building, while pastel accents create personality without shouting.

### Primary
- **Calm Proof Mint** (`#aee4d6`): the signature optimism color. It appears in badges, collaboration cues, highlight chips, and hover accents where the brand wants to feel open, collaborative, and fresh.

### Secondary
- **Notebook Yellow** (`#fde98a`): the warm action color. It powers primary buttons, sticky-note moments, and emphasis markers where the site needs a friendly but unmistakable call to action.

### Tertiary
- **Sketchbook Peach** (`#ffc8b8`): the emotional accent. It appears in scribble underlines, tape-like details, and soft highlights that give the brand warmth without drifting into sentimentality.

### Neutral
- **Paper Wash** (`#f4faf9`): the main canvas. It keeps the site airy, calm, and lightly tinted rather than stark white.
- **Pressed Paper** (`#dceeec`): the support neutral for soft contrast, fills, chips, and inset treatment.
- **Deep Ink** (`#2e3d3a`): the primary text, stroke, and structure color. It anchors the playful system with seriousness.
- **Soft Ink** (`#506b67`): the secondary reading color for supportive text, metadata, and quieter UI.
- **Sky Haze** (`#a9d4ec`): a cool counterweight for backgrounds and decorative variation.
- **Pencil Pink** (`#f4c5cf`): a soft emotional accent used sparingly in doodles and flourishes.
- **Dusty Lilac** (`#c8d4ec`): a balancing accent for calmer decorative shifts and section variety.

### Named Rules
**The Tinted-Neutral Rule.** The foundation is never pure black on pure white. Every neutral should carry a slight green-blue tint so the site feels physical and personal rather than digital-default.

**The Accent-Has-a-Job Rule.** Accent colors are not interchangeable decoration. Yellow calls action, mint signals openness, and peach carries warmth and emphasis.

## 3. Typography

**Display Font:** Caveat (with cursive fallback)  
**Body Font:** Nunito (with system-ui, sans-serif fallback)  
**Label/Mono Font:** Patrick Hand

**Character:** The pairing balances trust and identity. Caveat gives the site its handwritten signature, Patrick Hand carries labels and interface warmth, and Nunito makes longer reading and utility content feel clean, stable, and legible.

### Hierarchy
- **Display** (700, `clamp(3rem, 15vw, 6.75rem)`, 1): used for hero names and major titles that need memorable authorship.
- **Headline** (700, `clamp(2.8rem, 8vw, 5.2rem)`, 0.95): used for page heroes and major section framing.
- **Title** (700, `1.7rem` to `2.2rem`, 1 to 1.05): used inside cards, timelines, and richer content headings.
- **Body** (400, `1rem`, 1.65): used for all primary reading content. Body copy should stay within a readable measure, roughly 65–75ch on larger surfaces.
- **Label** (400, `0.92rem` to `1.25rem`, 1.2): used for metadata, navigation labels, chips, and interface cues where a hand-drawn voice adds warmth without reducing clarity.

### Named Rules
**The Signature-Then-Structure Rule.** Use Caveat for authored moments and Patrick Hand for supportive labels, but let Nunito carry comprehension. Handwriting establishes identity; sans serif carries trust.

## 4. Elevation

Elevation is structural and tactile, not atmospheric. The main public site uses hard offset shadows in deep ink to make buttons, cards, portrait frames, and notes feel like physical pieces placed on paper. The admin uses a softer shadow language so utility work feels calmer and easier to scan. Depth is created through borders, offsets, and paper layering more than through blur.

### Shadow Vocabulary
- **Crayon Small** (`3px 3px 0 var(--color-ink)`): used for buttons, note-like details, compact chips, and small tactile elements.
- **Crayon Medium** (`5px 5px 0 var(--color-ink)`): the default public card shadow for project cards and section surfaces.
- **Crayon Large** (`7px 7px 0 var(--color-ink)`): used for hero surfaces and larger signature containers where presence matters.
- **Soft Admin Lift** (`0 10px 28px rgba(46,61,58,0.05)` to `0 10px 30px rgba(46,61,58,0.08)`): used in admin shells and utility cards where sharp offsets would add noise.

### Named Rules
**The Shadow-Means-Object Rule.** Hard offset shadows are for tactile brand surfaces only. If the element should feel like a piece of paper, note, card, or button, use the crayon shadow language. If it should feel like infrastructure, use the softer admin lift or no shadow at all.

## 5. Components

### Buttons
- **Character:** friendly, tactile, and decisive.
- **Shape:** rounded rectangle with a soft hand-cut feel (`0.875rem` radius).
- **Primary:** yellow background, deep ink text, Patrick Hand typography, `3px 3px` offset shadow, generous horizontal padding.
- **Hover / Focus:** slight lift and stronger shadow on hover, compressed shadow on active. Ghost variants keep the border and dashed energy without becoming visually weak.
- **Secondary / Ghost:** ghost buttons stay transparent or paper-toned with a dashed border, especially for lower-priority actions and detail-page back links.

### Chips
- **Style:** small rounded pills with full borders, paper fills, and hand-labeled type.
- **State:** published/draft pills shift between mint and yellow; tech tags stay quieter and more paper-based.

### Cards / Containers
- **Character:** scrapbook surfaces with clear structure.
- **Corner Style:** asymmetrical or slightly irregular radii on public cards, cleaner rounded rectangles in admin.
- **Background:** paper as the baseline, sometimes layered with white gradients or light fills.
- **Shadow Strategy:** public cards use hard offset shadows; admin cards use softer ambient lift.
- **Border:** visible ink border or soft ink-tinted border depending on whether the component is public-brand or admin-utility.
- **Internal Padding:** comfortable, usually `1.25rem` to `1.5rem`, increasing on larger surfaces.

### Inputs / Fields
- **Character:** quiet and supportive, never ornamental.
- **Style:** softly rounded fields (`0.95rem`), paper-tinted fills, ink-tinted strokes, readable base text.
- **Focus:** border deepens, the field turns whiter, and a mint-tinted focus ring appears as the primary interaction signal.
- **Error / Disabled:** error states should lean on full-border and message clarity rather than stripe accents; disabled states should flatten contrast slightly without losing legibility.

### Navigation
- **Character:** a floating crafted object, not a flat bar.
- **Style:** white shell with ink border, soft interior card feel, doodle accents, and a logo tile that behaves like a branded stamp.
- **States:** immediate-load animation, hand-labeled links, scribble underline on desktop hover, true hamburger interaction on smaller screens.
- **Mobile treatment:** a dedicated collapsible menu panel, never a squeezed horizontal rail.

### Signature Component
- **Hero Portrait Block:** the portrait frame, pinned note, floating doodles, and scribble underline together form the clearest signature motif in the system. It should remain recognizably handcrafted, confident, and slightly playful without becoming noisy.

## 6. Do's and Don'ts

### Do:
- **Do** keep the paper base and ink structure intact, the brand needs calm trust before it adds play.
- **Do** use handwriting to signal authorship and warmth, then hand off longer reading to Nunito for clarity.
- **Do** keep hard offset shadows on public brand elements where tactility matters, especially buttons, feature cards, and portrait-like surfaces.
- **Do** let the site feel recognizably personal, through irregular corners, doodles, scribble accents, and thoughtful section pacing.
- **Do** preserve strong contrast, clear states, and reduced-motion support as non-negotiable defaults.

### Don't:
- **Don't** make the site feel template-like, too loud, or too generic. Those are explicit anti-references from PRODUCT.md and should be treated as hard failures.
- **Don't** swap the tinted paper system for pure white, pure black, or default SaaS gradients.
- **Don't** use side-stripe borders, gradient text, glassmorphism-by-default, or endless identical icon cards.
- **Don't** let the playful layer overpower comprehension. Creativity should support credibility, not compete with it.
- **Don't** flatten everything into safe corporate minimalism, but also **don't** chase overstimulated portfolio theatrics just to feel original.
