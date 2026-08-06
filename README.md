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
| `profile.html` | Six profiles. 2007 stratum. Each one ruined a different way, by its owner. |
| `settings.html` | Settings. 2002 stratum — frames, teal, and the roach motel. |
| `privacy.html` | The Privacy Policy. 28,778 words, and the scroll runs backwards. |
| `awards.html` | The Awards Cabinet. 2002 stratum, and it shows. |
| `assets/trophies.js` | Achievement engine, shared across pages, persisted to localStorage. |
| `assets/friendspace.css` | Shared chrome. Several crimes live in here. |
| `assets/people.js` | The membership. 25 accounts, shared by the feed and the profiles. |
| `assets/notes.js` | Design Notes — 28 annotations naming the principle each crime breaks. |
| `build.py` | Bundles all six screens into one self-contained `friendspace.html`. |

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

## Build

`python3 build.py` inlines the shared CSS/JS, scopes each page's stylesheet to its own
screen, and emits `friendspace.html` — one self-contained file with hash routing
(`#signup`, `#feed`, `#profile`, `#awards`) and no external requests. The multi-file
version stays the source of truth.

## Onboarding

Twelve steps, and **it does not matter what you put in.** The confirmation screen shows
what Friendspace recorded next to a struck-through copy of what you actually entered.
They never match. The phone number you spent two minutes selecting is filed as
`(555) 010-0100`.

- **Phone number** — one slider, 1 to 100,000,000. At full range that is ~167,000
  values per pixel, so dragging cannot land an exact number. Zoom narrows the range
  10× at a time; seven zooms takes you from 100,000,000 down to a window of ten,
  where the arrow keys finish the job. Tedium converted into a mechanic you can learn.
- **Username** — every name you want is taken. After three attempts the system assigns
  you one, `kegan_1967_xX47`, which you may accept. That is the escape hatch and also
  the joke.
- **Email verification** — the code is displayed to you, and rotates every 2.5 seconds.
  Four digits in two and a half seconds is a race you can win.
- **CAPTCHA** — the prompt changes every time you submit, so whatever you selected was
  for the previous question. It gives up on the third attempt. *"Select all squares
  containing regret."*
- **Profile photo** — dragging moves the frame rather than the picture, and it moves
  the wrong way. Inverted controls are learnable, which is what keeps it a toy.
- **Progress** — the step counter reads *1 of 4 → 2 of 6 → 4 of 9 → 8 of 14 → 10 of 16
  → 12 of 12*, while the bar shrinks from 62% before snapping to full.
- **Back** — "You cannot go back. Everything you have entered is final."
- **Cookie banner** — a hydra. Switching a partner off switches two earlier ones back
  on, so working top-down never converges. Start from the bottom and it falls in
  twelve clicks. The banner tells you: *"Partners are processed in order."*
  Both "Accept all" and "Reject all" enable everything.

Plus the slingshot volume control, the backwards-only calendar, the 68-key keyboard
that reshuffles after every press, 700ms-per-character email, the fleeing checkbox
(catch it with Tab + Space), and an eight-second hold-still submit.

## The membership

`assets/people.js` holds **25 accounts**, shared by the feed and the profiles — so
every post in the feed belongs to somebody you can go and visit, and everything they
say is in character. Verified: 69 sampled posts, zero authorship mismatches.

Most are trash by *content*. Nine are trash by *stylesheet*, because Friendspace lets
members paste raw CSS into their profile and does not validate it — historically
accurate, and structurally useful: **every broken profile is broken in canon.**

| Profile | What they did to it |
|---|---|
| **Terri from HR** | Never customised anything. The only readable page here. |
| **xXx_Nightshade_xXx** | Text one shade off the background. Measured 1.10:1 — WCAG requires 4.5:1. Also Papyrus. |
| **Ashleigh** | Hot pink, Comic Sans, glitter tiling, rotated headings, `text-shadow` on everything. |
| **Dad** | Pasted the stylesheet into the About Me box instead of the CSS box. Page is fine. Bio is a stylesheet, ending "Susan is this right". |
| **Aunt Deb** | Background at full camera resolution. Profile is 3,400px wide, page scrolls sideways. She does not know why. |
| **MARCUS_1987** | `* { display: inline }`. Entire profile is one paragraph. His comment: "looks fine on my end". |
| **MoonRiver Wellness ✨** | Brush Script, everything forced lowercase, 2.4 line-height. "not an mlm. an opportunity." |
| **BIG SAVINGS DAILY!!!** | Impact, all caps, pure yellow, pulsing headline. "ONLY 2 LEFT!!! (posted 2013)" |
| **Rick's Small Engine Repair** | Logo stretched to 230×60, `letter-spacing:-2px`, everything centred. Closed since 2011. Still posting. |
| **Gen. Marcus Steele** | Blurred profile photo, text unselectable. "I am unable to video call due to military regulations." |
| **SEVERED CIRCUIT** | Metalcore band page. New EP out now on MySpace. Shows: none. Last updated 2009. |

Plus: **Dad (2)** ("sorry everyone i got hacked this is my new account"), **Jessica
Williams ✔** (4 friends, the checkmark is part of her display name), **Braydon |
Financial Freedom 📈**, **Gerald Pruitt** (posts "google" and "weather tomorrow" as
statuses), **Marlene Hodge** (comments "Beautiful!" on a post about a flood),
**Walter Kessler** (posted his password as a status; when told, changed it to
`Buick1975!`), **@tyler.builds** (automated cross-poster, every link expired),
**Coach Danny R.** (only posts final scores), **Patricia Nunn** ("So sorry for your
loss ♥" on a photo of a couch), and **Sharon Whitaker** (minions).

**The comment wall is genuinely unbalanced HTML, not a simulation of one.** A comment
from 3/11/2009 opens a `<marquee>` and never closes it; another opens a `<font
size=7 color=red>` and never closes that. Every comment posted after them has been
inside those tags ever since. Verified in the DOM: one `<marquee>` element that
contains all subsequent comments.

**Top 8 is a climbing game.** You start at slot 8 and click yourself upward, but every
2.6 seconds the list "reorders nightly" and pushes you back down one. Out-click the
decay to reach #1.

**Profile songs stack.** Visiting six profiles leaves six tones running at once. The
volume level you landed with the slingshot during sign-up governs them — the only
setting on this website that is actually honoured.

The header and friend rail live outside the profile container, so no matter what a
member has done to their page, you can always leave. That's the escape hatch.

## The basement (2002 stratum)

**Settings** never got migrated — teal desktop, `MS Sans Serif`, a frame layout, a
title bar with dead minimise/maximise buttons.

- **Ten privacy toggles, each negated an arbitrary number of times.** *"Do not
  disallow non-restricted profile sharing."* The checkbox tells you nothing on its
  own, so a right-hand column reports what each setting **actually does** — which is
  what makes it a puzzle rather than a trick. You can always verify. Ticking every box
  leaves you at 5 of 10 sharing; decoding it properly gets all ten to PRIVATE.
- **"Make Everything Private"** ticks every box, which is not the same thing.
- **Save works. The confirmation lies** — it reports the inverse, and admits it:
  *"(The table above is correct. This summary is not.)"*
- **Your password is displayed** on the Account page, "for your convenience".

**Deleting your account is seven gates**, each a different small task so the corridor
stays playable: a confirmation, a survey where every answer is "I'll be back", three
escalating phrases to type (`DELETE` → `DELETE MY ACCOUNT` → `I UNDERSTAND THIS IS
PERMANENT`), a five-second hold, an identity check, and a 30-day cooling-off notice
that cancels if you log in — while you are logged in.

The final button says *"Your Friendspace account has been permanently deleted."*
Then: *"Welcome back! You have 1 new notification. While you were away, you liked a
post."* **Ghost stays locked.**

**The Privacy Policy** is 28,778 words across 1,400 paragraphs — 47,143px, about 400
screens at that pane height — displayed six lines at a time, and **the scroll wheel is
inverted**. It resets to the top every 14 seconds.

The escape hatch is a consequence of the crime rather than an exception to it: since
everything is inverted, **`Home` jumps to the bottom.** The page tells you after two
resets. Buried in the text: a clause claiming your immortal soul, one granting veto
power over your children's names, and Clause 15.3, which states that the account
deletion facility "is provided for illustrative purposes and does not delete accounts."

## Design Notes — the "why"

Press **`?`** anywhere, or find the whisper-text link in a footer (it's there, at about
1.06:1 contrast). Every annotated element gets a dashed outline and a numbered marker,
and a panel opens listing **28 notes**. Each one carries four fields:

- **Crime** — what the interface does
- **Principle broken** — the named law: Nielsen's heuristics (1994), Fitts's Law (1954),
  the Doherty Threshold (IBM, 1982), WCAG success criteria, Brignull's twelve deceptive
  patterns (2010)
- **What correct looks like** — the fix, in one sentence
- **In the wild** — who actually shipped this, and what it cost them

That last field is what turns the project from a funny bad website into an argument.
Some of it:

| Crime here | What it's a parody of |
|---|---|
| Seven-gate account deletion | Amazon named its Prime cancellation flow the **"Iliad Flow"** internally, after Homer's epic. FTC sued in 2023; **$2.5 billion settlement**. |
| Permanent, confirm-shamed Like | **Epic Games** paid a record **$245M** to the FTC in 2023, partly for interfaces making charges easy to trigger and hard to reverse. |
| The unreadable Privacy Policy | **GameStation's** 2010 April Fools terms claimed customers' immortal souls. Almost everyone accepted. |
| Consent buried in a dropdown | **Ryanair** hid "No Travel Insurance Required" alphabetically in a country list, **between Latvia and Lithuania** (2010). |
| Unescaped comment wall | **MySpace** allowed raw HTML/CSS in profiles. The **Samy worm** exploited it in 2005 and hit a million accounts in 20 hours. |
| Top 8 | Real. Shipped to millions. Remembered mostly for the friendships it damaged. |
| The hydra cookie banner | **GDPR** and the **EU Digital Services Act** both require refusal to be as easy as acceptance. |

Two modes: **On this screen** (notes for what's visible) and **All**, which lists
every note with off-screen ones dimmed.

The panel is the only well-designed thing on the site. That is the joke, and it is
deliberate — see `DESIGN.md` §4.

## Trophies

Fifteen awards, displayed as 88x31 web badges with bevel and lens flare. They drive
exploration: poking every broken control becomes a collection game.

**"Ghost" — *successfully delete your account* — is unobtainable.** It is listed,
greyed, and permanently taunting. `unlock()` refuses it even when called directly
from the console. That row is the thesis of the site.

## Verified

Driven end-to-end in Chromium: every crime fires, trophies persist across pages, and
there are no console errors.
