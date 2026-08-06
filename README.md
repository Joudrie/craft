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
| `index.html` | The sign-up form. Slingshot volume, million-value phone slider, fleeing checkbox. |
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

## Trophies

Fifteen awards, displayed as 88x31 web badges with bevel and lens flare. They drive
exploration: poking every broken control becomes a collection game.

**"Ghost" — *successfully delete your account* — is unobtainable.** It is listed,
greyed, and permanently taunting. `unlock()` refuses it even when called directly
from the console. That row is the thesis of the site.

## Verified

Driven end-to-end in Chromium: every crime fires, trophies persist across pages, and
there are no console errors.
