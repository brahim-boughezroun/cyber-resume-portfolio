# Cyber Resume Portfolio

A responsive Next.js portfolio presented as a neon cyber-terminal game world.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Change the fake portfolio content

Edit only:

```text
src/data/portfolio.ts
```

The name, role, about text, skills, experience, certifications, projects, contact details, and social links all come from this file.

## Controls

Desktop:

- Mouse wheel / normal page scrolling moves horizontally through the world.
- Left and right arrow keys move.
- Space makes the character jump.
- HUD buttons jump to a zone.

Mobile:

- The game world becomes a fast, readable vertical resume.

## Main files

```text
src/app/page.tsx
src/app/globals.css
src/components/desktop-world.tsx
src/components/mobile-resume.tsx
src/components/matrix-rain.tsx
src/components/player.tsx
src/data/portfolio.ts
```
