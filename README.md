# Frontend Mentor - Advice generator app solution

This is a solution to the [Advice generator app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/advice-generator-app-QdUG-13db).

**Live site:** https://toubayes.github.io/Advice-generator-app/

![Screenshot of the advice generator app](./screenshot.jpg)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Generate a new piece of advice by clicking the dice icon

### Features

- Fetches random advice from the [Advice Slip API](https://api.adviceslip.com)
- Requests a random advice id, so quick clicks never repeat (the API caches `/advice` for 2 seconds)
- Loading state (spinning dice), with built-in advice as a fallback if the API is down
- Copy and share buttons (uses the phone's share sheet where available)
- Shareable links: `?id=42` opens that exact piece of advice
- Press <kbd>Space</kbd> for new advice on desktop
- Responsive divider image via `<picture>`, keyboard-accessible dice button
- New advice fades in, and the dice reacts when pressed
- Respects `prefers-reduced-motion`

## Built with

- Semantic HTML5
- CSS custom properties, Flexbox and Grid
- Vanilla JavaScript (`fetch` with `async`/`await`)

## Running locally

No build step is needed. Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deployment

The site is hosted on GitHub Pages from the `main` branch, so every merge to `main` updates the live site.

## Author

- GitHub - [@toubayes](https://github.com/toubayes)
- Frontend Mentor challenge by [Frontend Mentor](https://www.frontendmentor.io)
