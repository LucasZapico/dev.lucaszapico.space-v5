# SOP: Portfolio Case Study Structure

> For dev.lucaszapico.space — targeting Senior Full-Stack Engineer roles at startups and mid-size companies.

## Purpose

Convince an engineering hiring manager that you make sound technical decisions, own features end-to-end, and ship real systems under real constraints. This is NOT a project spec or a sales pitch — it's evidence of engineering judgment.

## Audience

- Engineering managers and tech leads at startups / mid-size companies
- Occasionally: CTOs, senior ICs doing interview loops
- They skim first, read deeply only if the skim hooks them

## Tone

Quiet confidence. Direct. First-person ("I built", "I chose", "I owned"). No hedging, no hype. Show the thinking, not the resume bullet points.

---

## Structure

### 1. Hero Section (rendered in page layout, not prose)

| Field | Source | Notes |
|---|---|---|
| **Title** | Project name, descriptive | "Glassblowing Studio Digital Platform" |
| **Category** | Domain tag | "Commerce & Operations" |
| **Tags** | Tech stack pills | Max 7. Lead with the interesting ones. |
| **Impact one-liner** | Single sentence, concrete | "Replaced 4 SaaS tools with one unified platform" |
| **Screenshots** | Hero slideshow | 3-5 images from the live product |

### 2. The Problem (was "Overview")

**What to answer:**
- What was the business situation? Who is the client?
- What was broken, painful, or missing?
- What constraints existed (budget, timeline, technical ability of stakeholders)?

**What NOT to do:**
- Don't list technologies here
- Don't describe your solution yet
- Don't be vague ("they needed a website")

**Good example:**
> "The studio was running on Squarespace, Calendly, Square, and spreadsheets that couldn't talk to each other. The owners are artists with no technical background. They needed a single system they could operate without learning software — and it needed to support three business phases: pre-construction awareness, soft launch, and full operations."

**Source:** Project docs — BUSINESS-SUMMARY.md, REQUIREMENTS.md, project-scope.md, or equivalent. Pull the pain and constraints, not the solution.

### 3. My Role & Scope

**What to answer:**
- What did you own? (architecture, frontend, backend, infra, client communication?)
- Solo or team? How long?
- What decisions were yours to make?

**Why this matters:** Hiring managers need to know you weren't just the CSS person. At startups, they want people who own things end-to-end.

**Example:**
> "Solo developer, full ownership — from discovery conversations with the client through architecture, implementation, deployment, and ongoing operations. 6-month engagement, ongoing."

**Source:** Work agreements, CLAUDE.md project overviews, your direct knowledge.

### 4. Approach & Architecture

**What to answer:**
- What architecture did you choose and WHY?
- What were the key trade-offs?
- What alternatives did you consider and reject?

**Frame as decisions, not specs.** Not "I used NestJS" but "I chose a BFF pattern because the frontend needed to talk to 5 different services and I wanted credentials server-side."

**Include:** Architecture diagram if available (from BUSINESS-SUMMARY or ARCHITECTURE docs). Keep it simple — the ASCII diagrams from project docs work fine.

**Source:** ARCHITECTURE.md, BUSINESS-SUMMARY.md, CLAUDE.md tech stack sections, PLAN-*.md files.

### 5. Key Decisions & Trade-offs (2-4 decisions)

**What to answer:**
- What were the hardest or most interesting technical decisions?
- What did you choose, what did you reject, and why?
- What constraints drove the decision?

**This is the most important section for senior roles.** It shows engineering judgment, not just execution ability.

**Format:** Each decision as a short subsection with:
- The decision (bold, one line)
- The reasoning (1-2 paragraphs)
- What you rejected and why (shows you considered alternatives)

**Source:** "Key Technical Decisions" sections in existing docs, CRM-PIPELINE-STRATEGY.md, SEARCH_SPEC.md, email-channels.md, etc.

### 6. What Was Hard

**What to answer:**
- What surprised you or was harder than expected?
- How did you solve it?
- What would you do differently with hindsight?

**This section builds trust.** Everyone has hard problems. Senior engineers talk about them honestly.

**Source:** BACKLOG.md blockers, BUGFIXES.md, technical-journal.md, CODE-REVIEW files, your direct experience.

### 7. The Result

**What to answer:**
- What shipped? Is it live?
- Concrete outcomes (tools replaced, time saved, capability unlocked)
- Metrics if you have them (but don't fabricate)
- Current status (production, ongoing, handed off)

**Be concrete.** Not "this demonstrates end-to-end ownership" but "the studio stopped paying for Squarespace, Calendly, and Square — saving ~$300/month — and the owner manages everything through Directus without touching code."

**Source:** FEATURE-COVERAGE.md, BACKLOG.md (completed items), deployment configs (proves it's live), your direct knowledge.

---

## Data Storage

All case study content lives in `app/lib/case-studies.ts` as JS objects. No MDX.

```ts
interface CaseStudy {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  impact: string;       // one-liner for hero
  overview: string;     // "The Problem" section
  heroImages: string[];
  sections: CaseSection[];
}
```

Each section has a `heading`, optional `image`, and `blocks` array of `{ type: "text", html }` or `{ type: "list", items }`.

## Section Headings (use these consistently)

1. **The Problem** — replaces "Overview"
2. **My Role** — new, always include
3. **Approach** — replaces "Architecture"
4. **Key Decisions** — replaces "Key Technical Decisions"
5. **What Was Hard** — replaces "Technical Challenges"
6. **The Result** — replaces "What This Demonstrates"

Optional sections (use when relevant):
- **Data Pipeline** (SilverLife)
- **Search & Filtering** (SilverLife)
- **The Booking Problem** (Fly Fishing)
- **Security** (Therapist Portal)

## Workflow: Project Docs → Case Study

1. Read the project's docs/ directory (BUSINESS-SUMMARY, ARCHITECTURE, FEATURES, BACKLOG, REQUIREMENTS, etc.)
2. Extract the pain/problem from business docs
3. Extract architecture decisions and trade-offs from technical docs
4. Extract what shipped from FEATURE-COVERAGE or equivalent
5. Fill gaps with direct knowledge (role, constraints, outcomes)
6. Write in first person, decision-focused, concrete
7. Add to `case-studies.ts`

## Checklist Before Publishing

- [ ] "The Problem" describes pain, not solution
- [ ] "My Role" explicitly states ownership scope
- [ ] Every architecture choice has a "because" attached
- [ ] Key Decisions shows what you rejected, not just what you chose
- [ ] "The Result" has at least one concrete outcome (not abstract)
- [ ] No technology name appears without a reason for choosing it
- [ ] Reading it cold, a hiring manager can tell what YOU did vs. what existed
- [ ] Screenshots show real product, not mockups
