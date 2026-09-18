# Daily Pulse

Build a minimal personal productivity web app called "pulse".

App Shape — Floating Capsule Widget:

The entire app lives inside a single tall pill-shaped container, centered on screen vertically and horizontally
Max-width: 380px, min-height: 700px
Border-radius: 50px (fully rounded capsule feel)
Frosted glass surface: rgba(255,255,255,0.40), backdrop-filter: blur(24px), subtle 1px border of rgba(255,255,255,0.6)
The top of the capsule has a large arch/stadium-shaped window (about 140px tall, fully rounded top with border-radius: 180px 180px 40px 40px) containing a soft animated gradient orb inside it — purely decorative, creating a dreamy "portal" look
Below the arch, all content flows vertically inside the capsule with generous padding (24px sides)
Cards inside the capsule use subtler frosted glass (rgba(255,255,255,0.25), backdrop-filter: blur(12px), border-radius: 20px) to layer without competing
Background (behind the capsule):

Soft warm off-white base (#F5F0EB)
2–3 large blurred gradient orbs floating behind everything using soft rose/pink (#E8A0BF, #F4C2C2) and hints of peach (#FADADD)
Apply CSS blur (100–120px) so they feel like dreamy ambient light, not shapes
Orbs should subtly drift using a slow CSS animation (30s infinite loop) to feel alive and calming
Typography and Style:

Font: Satoshi (import from https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500&display=swap
) for all body text. Space Grotesk (Google Fonts) for numbers, time blocks, and streak counter
Light weights (300–400) for body, medium (500) for active/hero elements
All text lowercase for aesthetic consistency
Primary text: near-black (#1A1A1A). Secondary/muted text: (#8A8A8A)
Accent color: muted rose (#C97B9A) — used only for active time block pill and the "done" button
No emojis anywhere. Use only minimal unicode symbols: ✦ for streak and done button, ○ for unchecked task, ● for checked task, → for any transitions
Micro-animations: soft fade-ins on load (300ms), smooth checkbox transitions, gentle hover lift on interactive elements (translateY -2px, 200ms ease)
Layout inside the capsule (top to bottom):

Arch Window (decorative): A large rounded arch at the top of the capsule containing an animated soft pink-to-peach radial gradient blob. No text, no interaction — just ambient visual calm.

Header: "pulse" in lowercase with wide letter-spacing (0.2em), font-weight 400, left-aligned. Current date in muted gray text ("thursday, 18 september") right-aligned. Same line.

"Right Now" hero card: The most prominent frosted glass card inside the capsule. Shows:

Current time block label in small muted uppercase text at top (e.g., "12 – 2 · dsa")
The top undone task name in medium weight (500) below it
A small muted pill for the goal tag
One button at bottom-right: "done ✦" in accent color
When clicked, smoothly strikes through the task (opacity 0.4, strikethrough), then fades in the next undone task. If all tasks in the block are done, show "all clear ✦" in muted text
Today's Blocks: A horizontal scrollable row of small frosted glass pills. Each pill shows time range and label (e.g., "12–2 · dsa", "2–3 · apply", "3–5 · study"). The current active block (based on system time) has a soft rose accent background. Completed blocks dim to 45% opacity. Clicking any block reveals its tasks in the task list below.

Task List: A clean vertical list inside a subtle frosted glass card for the selected block. Each task row has:

A soft circular toggle (○ when undone, ● when done) — clicking toggles the state
Task text
A small muted goal tag pill on the right
Completed tasks: strikethrough text, 40% opacity
At the bottom: a minimal inline input ("+ add task"), completely borderless until focused, then shows a subtle bottom line in accent color
New tasks get a goal tag dropdown (options: dsa, placement, midsem, internship, free) styled as a minimal muted pill selector
Bottom section: Inside the capsule at the bottom:

A thin horizontal progress bar (4px tall, rounded, accent fill on muted track) showing daily completion percentage
Below it: "✦ 4 days" streak counter in small muted text, centered
Functionality:

Time blocks are editable: click on any block pill to edit its start time, end time, and label via a minimal inline edit mode
Tasks belong to a specific time block and have a goal tag
The "Right Now" hero card automatically determines the current block based on the user's system time and displays the first undone task from that block
If the current time doesn't fall within any defined block, the hero card shows "no active block" in muted text
Daily completion score = (completed tasks / total tasks) × 100
Streak counter: increments each day the user completes at least 70% of tasks. Resets to 0 if a day is missed. Stored in localStorage
All data (blocks, tasks, streak, completion history) stored in localStorage — no backend, no authentication
Responsive but optimized for laptop/desktop viewing
On first visit, pre-populate with sample blocks: "12–2 · dsa", "2–3 · apply", "3–5 · study", "5–6 · internship" with 2 sample tasks each so the app doesn't look empty

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pulse-capsule-flow.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d8c82f8e-4162-483c-b40d-aef4bf1a9810).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
