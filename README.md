# MoodGarden

A small web app for tracking how you're doing day to day - mood, stress, sleep, food, movement, journal notes, and a few extras. You pick a companion - cat, dog, rabbit, penguin, and more, give it a name, and use the app like a quiet garden you tend over time.

MoodGarden is a personal tracker, not medical advice or crisis support.

## Privacy

Everything is stored **in your browser** on this device. Clearing site data or your browser storage can remove it. There is no account system and no server storing your entries.

## Run it locally

You'll need **Node.js 18+** and npm.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

**Production build:**

```bash
npm run build
```

**Preview the build:**

```bash
npm run preview
```

Optional - check code style:

```bash
npm run lint
```

## What's inside (in plain terms)

- Dashboard and calendar-style views
- Trackers for mood, stress, sleep, appetite, gentle movement, journal, todos, and important dates
- Insights and simple charts (descriptive, not diagnostic)
- Light / dark appearance
- A short privacy note in the app so people know data stays on this device

## Tech stack

React, TypeScript, Vite, Tailwind CSS, React Router, Recharts, and date-fns.
