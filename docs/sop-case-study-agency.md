# SOP: Agency Case Study Structure

> For bluemonkeymakes.com — targeting business owners and operators who need custom software built.

## Purpose

Convince a potential client that you understand their kind of problem and can deliver a solution that works. This is a sales tool. The reader should finish thinking "this person gets it — I want them to build mine."

## Audience

- Business owners and operators (non-technical or semi-technical)
- They care about outcomes, process, and trust — not your tech stack
- They're evaluating whether to hire you, not whether you're a good engineer

## Tone

Consultant/partner. Confident but approachable. Avoid jargon unless the audience expects it. Frame everything through the client's business, not your engineering.

---

## Structure

### 1. Hero Section

| Field | Source | Notes |
|---|---|---|
| **Title** | Client-facing project name | "Eastside Art Glass — Digital Platform" |
| **Category** | Business problem type | "Commerce & Operations" |
| **Client** | Business name (with permission) | Or anonymized: "Detroit Glassblowing Studio" |
| **One-liner** | Business outcome, not tech | "One platform replaced four SaaS tools and gave the studio full control of their operations." |
| **Hero image** | Best screenshot of the live product | Show the product, not the architecture |

### 2. The Situation

**What to answer:**
- Who is the client? What do they do?
- What was their world like before this project?
- What pain triggered them to reach out?

**Frame through the client's eyes.** Not "they needed a monorepo" but "they were paying for four different tools that didn't talk to each other, and they were losing class enrollments because of it."

**Source:** BUSINESS-SUMMARY.md, project-scope.md, work-agreement.md, discovery notes.

### 3. The Challenge

**What to answer:**
- What made this problem hard to solve?
- What constraints existed? (budget, timeline, non-technical team, phased rollout)
- What had they already tried?

**This builds empathy with the reader.** They likely have similar constraints. Show you understand those constraints aren't just annoying — they shape the solution.

**Source:** Project-scope blockers, work-agreement constraints, REQUIREMENTS.md.

### 4. Our Approach

**What to answer:**
- How did you approach discovery? What did you learn?
- What was the strategy before writing code?
- How did you break the problem into phases?

**Show process, not just output.** Business owners want to know what it's like to work with you. This section answers "what happens after I sign?"

**Include:** Phase breakdown if the project had phases. Show that you plan and prioritize, not just build.

**Source:** ROADMAP.md, work-agreement phases, PLAN-*.md files.

### 5. The Solution

**What to answer:**
- What did you build? (features, not architecture)
- How does it work from the client's perspective?
- What can they do now that they couldn't before?

**Lead with capabilities, not technology.** Not "NestJS BFF proxying Directus" but "the studio owner adds a class in the CMS, and the system handles enrollment, payment, confirmation emails, CRM tracking, and waitlist management automatically."

**Tech stack as a brief aside** — a small callout or tag list, not the focus.

**Screenshots:** 2-4 showing the product in use. Annotate if helpful.

**Source:** FEATURES.md, FEATURE-COVERAGE.md, FRONTEND_FEATURES.md, screenshots.

### 6. The Result

**What to answer:**
- What's the business outcome? (cost savings, time saved, capability unlocked, revenue enabled)
- Is it live? How long has it been running?
- Client quote or reaction (if available)
- What's next? (shows ongoing relationship)

**Be concrete.** Numbers are better than adjectives. "Replaced $300/month in SaaS tools" beats "streamlined operations."

**Source:** Work-agreement milestones, your direct knowledge, client feedback.

### 7. What This Means For You (optional CTA section)

**What to answer:**
- What kind of business would benefit from a similar approach?
- How do they start a conversation?

**This is the sales close.** Light touch. One sentence connecting the case study to the reader's situation, then a CTA.

---

## Key Differences From Portfolio Case Studies

| | Portfolio (hire me) | Agency (hire my services) |
|---|---|---|
| **"I built"** vs **"We delivered"** | First person singular | First person plural or client-focused |
| **Architecture decisions** | Deep, with trade-offs | Brief, in service of business outcome |
| **Tech stack** | Prominent, detailed | Background, supporting |
| **Target reader question** | "Is this person a good engineer?" | "Can they solve my problem?" |
| **Result framing** | "I shipped X, owned Y" | "The client can now do X, saving Y" |
| **What Was Hard** | Technical challenges | Business/process challenges |
| **Tone** | Senior IC engineer | Consultant/partner |
| **Jargon** | Expected (PostGIS, RBAC, BFF) | Avoided (use plain language) |

## Section Headings (use these consistently)

1. **The Situation** — who and what
2. **The Challenge** — why it was hard
3. **Our Approach** — how we worked
4. **The Solution** — what we built (features, not architecture)
5. **The Result** — business outcomes

## Workflow: Project Docs → Agency Case Study

1. Read BUSINESS-SUMMARY, project-scope, work-agreement — extract the business story
2. Read FEATURES or FEATURE-COVERAGE — extract what was built in business terms
3. Extract phases/timeline from work-agreement or ROADMAP
4. Translate architecture decisions into business value ("we chose self-hosted so the client owns their data and doesn't pay per-seat SaaS fees")
5. Get concrete outcomes (cost, time, capability)
6. Write in client-focused language
7. Add screenshots that show the product, not the code

## Checklist Before Publishing

- [ ] A non-technical business owner can read it and understand what you did
- [ ] No unexplained jargon (or jargon is defined in context)
- [ ] The client's problem is clear in the first paragraph
- [ ] Features are described as capabilities ("the owner can..."), not implementations
- [ ] At least one concrete business outcome (cost, time, capability)
- [ ] Screenshots show the product from the user's perspective
- [ ] CTA connects the case study to the reader's potential situation
- [ ] Client has approved the case study for publication (or content is anonymized)
