# Build “pulse”

## Scope
- Replace the blank home screen with the complete single-capsule productivity app.
- Match the supplied warm frosted-glass visual direction, typography, ambient animation, and lowercase copy.
- Keep all blocks, tasks, completion history, and streak data in the browser only.

## Experience
- Create the animated arch portal, compact header, current-task card, horizontally scrollable time blocks, editable task list, and daily progress footer.
- Make block pills selectable and editable inline.
- Support completing the current task, toggling any task, adding tasks with a goal tag, and automatic active-block detection.
- Seed four sample blocks with two tasks each on first use.

## Behavior
- Persist state in localStorage after hydration.
- Calculate daily completion from completed tasks and maintain the 70%-completion streak rule across dates.
- Use smooth transitions, accessible controls, and responsive sizing while preserving the laptop-first capsule layout.

## Technical details
- Use the existing TanStack Start route and Tailwind v4 design tokens.
- Load Satoshi and Space Grotesk from document head links.
- Add route-specific metadata for the home screen.
- Verify the rendered app and core interactions in the browser at desktop and narrow sizes.
