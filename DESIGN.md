# Friendspace — Design Document

> **Friendspace**, *a Palgorithm Holdings company*
> "Where friends happen to you."
> A social network that launched in 2004 and has never left beta. The only tracked
> metric is Time On Site. No designer has ever been employed here.

---

## 0. The Prime Directive

**Every crime must be a toy, not a wall.**

A toy responds when you poke it and invites another poke. A wall stands there and
costs you time. This site's entire value is that people *want* to mess with the
broken controls — anything that makes them flinch instead of lean in is cut, no
matter how funny it is in the abstract.

### The Toy Test

Any proposed crime must pass all three:

1. **Does it react to input?** Walls are inert, or they interrupt unprompted.
2. **Can you get better at it?** Skill implies replay. Replay implies fun.
3. **Does failing make you laugh or sigh?**

### Corollary: juice is mandatory

If the controls are terrible, the *feedback* must be superb — physics, overshoot,
trails, sound, animation. The slingshot is fun because it's juicy, not because it's
bad. Inert bad UI is just broken software.

This does not violate the "nothing good" rule: over-animation and excessive motion
are themselves documented design crimes (WCAG 2.3.3, prefers-reduced-motion). We are
committing one crime to make another crime playable.

### The two flavors of bad

The premise licenses both, and they need different justifications:

| Flavor | Looks like | Justified by |
|---|---|---|
| **Malice** | Dark patterns, engagement traps, un-deletable accounts | "The only metric is Time On Site" |
| **Incompetence** | Contrast crimes, nine fonts, nothing aligned | "Never left beta, no designer, three unfinished redesigns" |

---

## 1. The Strata

No migration ever finished, so the site is layered by age. **The deeper you
navigate, the older the design gets.** This makes the visual chaos coherent instead
of noisy — and stratified legacy UI is a real thing that happens to real products,
which is what makes it satire rather than randomness.

| Depth | Era | Surface | Visual language |
|---|---|---|---|
| Chrome | 2021 | Cookie banner, footer only | Flat, sans-serif, competent-looking. Covers nothing else. |
| Main | 2013 | Feed, signup | Flat design, half-applied. Ghost buttons, thin type. |
| Social | 2007 | Profiles | MySpace. Glitter, autoplay, user-injected CSS. |
| Basement | 2002 | Settings, Help, Privacy Policy | Frames. Tables. Under construction. |

Reaching the 2002 stratum should feel like archaeology, and earns a trophy.

---

## 2. The Trophy System

The 2003-era **Awards page** is reskinned as an achievement system. This is the
primary engine for the Prime Directive: it converts "poke the broken thing" into a
collection game and gives players a reason to try every control.

Trophies render as 88x31 web badges with bevel and lens flare.

| Trophy | Unlock |
|---|---|
| 🏆 Marksman | Land the volume slingshot on exactly 0 |
| 🏆 Archaeologist | Reach the 2002 stratum |
| 🏆 Escape Artist | Catch the fleeing checkbox |
| 🏆 Pi Enthusiast | Enter your birthday by π index |
| 🏆 Completionist | Untick all 24 cookie partners |
| 🏆 The Long Way | Navigate back 300 months in the calendar |
| 🏆 Actually Read It | Scroll the privacy policy to the bottom |
| 🏆 Social Climber | Reach #1 in someone's Top 8 |
| 🏆 Ghost | Successfully delete your account |

**"Ghost" is unobtainable.** It is listed, greyed, and permanently taunting. Deleting
your account is a roach motel; the trophy is a lie. This is the thesis of the whole
site in one row of a table.

---

## 3. Crime Catalogue

Every crime is tagged with the principle it violates and its guaranteed escape hatch.
**Nothing is merely broken** — there is always a legitimate path through.

### 3.1 Signup (front door — mostly built, see `index.html`)

| Crime | Principle violated | Escape hatch |
|---|---|---|
| Slingshot volume control | Fitts's Law; feedback loop | Practice. Landing short = silence. |
| Phone: 1..1,000,000 slider | Fitts's Law; input precision | Arrow keys move by 1 |
| Backwards-only calendar | Efficiency of use (Nielsen #7) | Hold to auto-repeat |
| Reshuffling on-screen keyboard | Recognition over recall (Nielsen #6) | Hunt and peck |
| 700ms/char email validation | Doherty threshold (<400ms) | Type slowly |
| Fleeing terms checkbox | Fitts's Law; accessibility | Tab + Space — it cannot flee the keyboard |
| 8-second hold-still submit | Error prevention (Nielsen #5) | Hold still |
| Full name field | *None. It works perfectly.* | — |

**Upgrades to steal from r/badUIbattles** (see §6): swap the email field for the
**Ouija board**, the phone for **Etch-a-Phone** (draw digits with two dials, unreliable
OCR), and add **Index of π** as an alternate birthday entry method.

### 3.2 The Feed (centerpiece — original work)

This is where the project stops being a remix. The entire bad-UI genre has mined
*input controls* and left *consumption* untouched. These are the crimes that only
exist on a platform.

| Crime | Principle violated |
|---|---|
| New posts insert **above** your scroll position | Scroll anchoring (real bug in real apps — sharpest satire available) |
| Feed **reshuffles on every scroll** — no post findable twice | Consistency & standards (Nielsen #4) |
| Read posts grow **larger**; unread ones shrink | Visual hierarchy inversion |
| Notification badge **counts down** as you receive more | Visibility of system status (Nielsen #1) |
| "See more" **collapses** instead of expanding | Trick wording (Brignull) |
| Like = long-press → confirm modal → **cannot unlike** | Roach motel (Brignull); user control & freedom (Nielsen #3) |
| Every timestamp reads "4h ago" | Visibility of system status |
| Like counts are a live **random walk** | Feedback integrity |
| Your own posts are **hidden from you** | Match between system and real world (Nielsen #2) |
| Infinite scroll + footer holding the only useful links | Obstruction (Brignull) |
| "Sponsored" set 4px, #F0F0F0 on #FFF | **Disguised ads** (Brignull) + WCAG 1.4.3 (1.05:1 contrast) |
| Search results sorted by **irrelevance** | Match between system and real world |

**Note on ads:** disguised ads stay — they are inline, non-blocking, and passing the
Toy Test (spotting them becomes a game). **Pop-ups, pop-unders, and interstitials are
cut.** See §5.

### 3.3 Profiles (2007 stratum)

- **Top 8 friends** — a public, ranked, reorderable list of your friends. The most
  sociopathic feature ever shipped by a major platform, and it was real. Ours
  reorders itself nightly and notifies everyone affected.
- **User-injected profile CSS** — historically accurate, and structurally brilliant:
  every fake profile can be broken a *different* way, in-canon. One is dark-on-dark
  and unreadable; one has a 4000px background forcing horizontal scroll; one sets
  `* { cursor: url(sword.cur) }`.
- **Comment wall with unescaped HTML** — someone left an unclosed `<marquee>` in 2009
  and everything below it still scrolls. A stranger's single typo permanently
  deforming another stranger's page for seventeen years.
- **Profile songs** that autoplay and stack across tabs.
- Crop tool where the crop box moves but the image doesn't.
- Friend count that decreases as you scroll.

### 3.4 Settings & Privacy (2002 stratum — the roach motel)

- 40 toggles, **all pre-checked** (*Preselection*, Brignull), labeled in **double
  negatives**: "Do not disallow non-restricted sharing." (*Trick questions*, Brignull)
- Save resets everything.
- **Delete Account** is seven levels deep, confirmshames at each step, and the final
  button likes a post. (*Roach motel* + *confirmshaming*, Brignull)
- Real `<frameset>`. Back button breaks, bookmarking is meaningless, one frame never
  updates.

### 3.5 Privacy Policy

- 30,000 words shown three lines at a time in a fixed box that scrolls **upward**.
- "I have read and understood" unlocks only at the bottom; the box resets every 10s.
- Absurd clauses buried inside (see GameStation's 2010 "immortal soul" April Fools).
- The page itself is titled `Untitled Document`.

### 3.6 Ambient / site-wide

- **MIDI autoplay** (`<bgsound loop="infinite">`, hidden, no controls). This is the
  *setup* whose punchline is the slingshot: the site plays music at you and the only
  volume control is a catapult. One joke, not two.
- **Gravity scrollbar** — `DeviceOrientationEvent` on mobile; tilt the phone and the
  thumb obeys gravity. Desktop: the thumb has weight and sags toward the bottom if
  unheld. *Not seen anywhere in the genre — likely original.*
- `<title>Untitled Document</title>` on every page. The Dreamweaver default. The
  funniest single line available and it costs nothing.
- Favicon is a JPEG with visible compression artifacts.
- Cursor sparkle trails. Falling snow, in August.
- Hit counter that **decrements**: "You are visitor #000,847".
- Guestbook in the footer, last signed 2006, full of Cyrillic spam.
- Webring nav (`‹ prev | random | next ›`) to sites that do not exist.
- "Last updated: 3/14/2002" beneath posts from today.
- Tiled background with visible seams every 200px.
- "Best viewed at 800×600" — and it is. Anything else horizontal-scrolls.

---

## 4. The "Design Notes" Toggle

A hidden toggle. Once enabled, every element sprouts an annotation badge naming the
crime, the principle violated, and what the correct implementation would be.

First visit it's a joke. Second visit it's a lecture. This is what converts the
project from *a funny bad website* into *a designer demonstrating fluency* — the
distinction a hiring manager cares about.

**Open decision:** this panel would be the one well-designed thing on the site,
which conflicts with the "nothing good" rule. Resolution chosen: **make the toggle
hostile to find**, so discovering it is earned. The panel itself is clean.

---

## 5. Cut List

Explicitly not doing these, and why. All of them fail the Toy Test.

| Cut | Reason |
|---|---|
| Pop-up / pop-under ads | Pure wall. Blocks the controls people came to play with. |
| Interstitial ads over the feed | Same. Obstructs the actual content. |
| `alert()` on page load | Steals focus, modal, zero interactivity. |
| `onbeforeunload` ("are you sure?") | Punishes leaving. Not a toy. |
| Auto-resizing the browser window | Hostile with no play in it. |
| Right-click disabled **+ alert** | Keep the disable as flavor; **cut the alert**. |
| Real credential collection | Non-negotiable. See §7. |

**Cookie banner — defanged, not cut.** 24 toggles is currently tedium (a wall) sitting
at the very front door. Convert it to a puzzle: **unticking one re-ticks two others**,
hydra-style, with a solvable order. Same joke, now a toy.

---

## 6. Prior Art

Know the genre so we don't rebuild someone else's joke.

- **[User Inyerface](https://userinyerface.com/)** (Bagaar, 2019) — the gold standard.
  One signup form, played as a timed speedrun. Our signup lives in its shadow; the
  rest of the site is unclaimed ground.
- **2017 volume contest** (r/ProgrammerHumor) — catapult, shout-controlled slider,
  latitude-on-a-globe, digits of π. *The catapult predates our slingshot; treat as
  validation, not a reason to drop it.*
- **[r/badUIbattles](https://knowyourmeme.com/memes/sites/rbaduibattles-bad-ui-battles)**
  — original creations only; reposting real bad UI is against the rules. Same spirit
  as this project.
- **Archives:** [Awesome Bad UI](https://goulartnogueira.github.io/BadUI/) ·
  [mattw.io/bad-ui](https://mattw.io/bad-ui/)
- **Best individual gags to adapt:** Index of π (birthday), fan-blows-your-cursor
  (unsubscribe), upload-a-JPEG-per-letter (name), Etch-a-Phone (OCR dials),
  High/Low birthday, Ouija email, tear-through-a-3D-net (delete account).
- **Assets:** [GifCities](https://gifcities.org/) — the Internet Archive's GeoCities
  GIF search engine. Period-authentic animated GIFs, free.
  [Cameron's World](https://www.cameronsworld.net/) for visual reference.

---

## 7. Constraints

- **Never accept a real password or real personal data.** The site looks plausible and
  will be shared as a link; a convincing login page that collects credentials is
  phishing regardless of intent. Keep the fakeness legible in the branding.
- **Do not use Meta's actual logo, wordmark, or trade dress.** Parody is well
  protected; trademark imitation is a different question. Costs nothing comedically.
- **Audio capped** at 0.11 gain. Irritating, not harmful.
- **Every crime ships with its escape hatch.** Functional but nearly impossible — never
  merely impossible.

---

## 8. Build Order

1. **Trophy system** — first, because every subsequent crime registers into it.
2. **The Feed** — the centerpiece and the most original work.
3. **Retrofit `index.html`** as the Friendspace signup front door.
4. **Profiles** — the 2007 stratum, Top 8, injected CSS.
5. **Settings + Privacy Policy** — the 2002 basement and the roach motel.
6. **Design Notes toggle** — last, once there are crimes to annotate.

Ambient crimes (§3.6) land continuously throughout.
