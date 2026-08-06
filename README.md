# Friendspace

> *a Palgorithm Holdings company* — "Where friends happen to you."

A parody social network where every control is deliberately hostile and every
control still works. Open any page — no build step, no dependencies.

See **[DESIGN.md](DESIGN.md)** for the premise, the crime catalogue, and the rules
this thing is built to.

## The prime directive

**Every crime must be a toy, not a wall.** A toy responds when you poke it and
invites another poke; a wall just costs you time. Anything that blocks or interrupts
— pop-ups, load-time alerts, unload prompts — is cut, however funny in the abstract.

Every crime ships with a legitimate escape hatch. **Nothing is merely broken.**

## What's here

| File | What it is |
|---|---|
| `feed.html` | The feed. 2013 stratum. Twelve crimes, most of them original to this project. |
| `index.html` | Onboarding. Eight-step wizard, and none of it counts. |
| `awards.html` | The Awards Cabinet. 2002 stratum, and it shows. |
| `assets/trophies.js` | Achievement engine, shared across pages, persisted to localStorage. |
| `assets/friendspace.css` | Shared chrome. Several crimes live in here. |

## Feed crimes

| Crime | Principle violated |
|---|---|
| New posts insert **above** your scroll position | Scroll anchoring — `overflow-anchor:none` deliberately disables the browser feature that prevents this |
| Feed reshuffles as you scroll | Consistency & standards (Nielsen #4) |
| Read posts grow larger, unread shrink | Visual hierarchy, inverted |
| Notification badge counts **down**, into the negatives | Visibility of system status (Nielsen #1) |
| "See more" collapses | Trick wording (Brignull) |
| Liking: long press → confirm → permanent | Roach motel (Brignull); user control (Nielsen #3) |
| Your posts vanish, then a stranger replies to them | Match with the real world (Nielsen #2) |
| "Sponsored" at 4px, `#F0F0F0` on white | Disguised ads (Brignull) + WCAG 1.4.3 — 1.05:1 contrast |
| Search sorted by irrelevance | — |
| Every timestamp reads "4h ago" | Visibility of system status |
| Like counts as a live random walk | Feedback integrity |
| Infinite scroll hiding the only useful links | Obstruction (Brignull) |

The infinite scroll has a 900ms debounce. **Outrun it and you reach the footer** —
a skill-based escape hatch, and a trophy.

## Onboarding

Eight steps, and **it does not matter what you put in.** The confirmation screen shows
what Friendspace recorded next to a struck-through copy of what you actually entered.
They never match. The phone number you spent two minutes selecting is filed as
`(555) 010-0100`.

- **Phone number** — one slider, 1 to 100,000,000. At full range that is ~167,000
  values per pixel, so dragging cannot land an exact number. Zoom narrows the range
  10× at a time; seven zooms takes you from 100,000,000 down to a window of ten,
  where the arrow keys finish the job. Tedium converted into a mechanic you can learn.
- **Progress** — the step counter reads *1 of 4 → 2 of 6 → 4 of 9 → 6 of 11 → 8 of 8*,
  while the bar shrinks from 62% to 20% before snapping to full.
- **Back** — "You cannot go back. Everything you have entered is final."
- **Cookie banner** — a hydra. Switching a partner off switches two earlier ones back
  on, so working top-down never converges. Start from the bottom and it falls in
  twelve clicks. The banner tells you: *"Partners are processed in order."*
  Both "Accept all" and "Reject all" enable everything.

Plus the slingshot volume control, the backwards-only calendar, the 68-key keyboard
that reshuffles after every press, 700ms-per-character email, the fleeing checkbox
(catch it with Tab + Space), and an eight-second hold-still submit.

## Trophies

Fifteen awards, displayed as 88x31 web badges with bevel and lens flare. They drive
exploration: poking every broken control becomes a collection game.

**"Ghost" — *successfully delete your account* — is unobtainable.** It is listed,
greyed, and permanently taunting. `unlock()` refuses it even when called directly
from the console. That row is the thesis of the site.

## Verified

Driven end-to-end in Chromium: every crime fires, trophies persist across pages, and
there are no console errors.
