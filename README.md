# craft

A deliberately hostile signup form. Every control is functional and every control
is nearly impossible. Open `index.html` — no build step, no dependencies.

The rule for every field: there is always a legitimate path to completion. Nothing
is merely broken.

| Field | The crime | The way through |
|---|---|---|
| Full name | None. It works perfectly. | — |
| Notification volume | Angry Birds slingshot. Pull the speaker back, release, and wherever it lands on the 0–100 scale is your level. An annoying tone plays the whole time. | Practice your arc. Landing short of the scale is silence. |
| Phone number | A slider from 1 to 1,000,000 for the subscriber number. ~1,700 values per pixel. The area code dropdown reshuffles every time you open it. | Arrow keys move by exactly 1. |
| Date of birth | Calendar opens on today. "Next month" is disabled. | One click per month, backwards. Hold to auto-repeat. |
| Password | On-screen keyboard only; all 68 keys reshuffle after every single keypress. | Hunt. Peck. Repeat. |
| Email | Each character takes 700 ms to "validate". Typing during the wait discards the character. Paste is disabled. | Type slowly. |
| Terms checkbox | Flees the cursor. | It cannot run from the keyboard. Tab to it, press Space. |
| Cookie banner | 24 partners, all enabled, must all be off to dismiss. "Reject all" and "Accept all" both enable everything. | Untick all 24 by hand. |
| Submit | Hold for 8 seconds. Moving the pointer more than 4px resets it. | Hold still. |

Audio is capped at a gain of 0.11 — irritating, not harmful.

Verified end-to-end in Chromium: the entire form is completable, with no console errors.
