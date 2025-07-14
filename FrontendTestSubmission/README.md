# React URL Shortener Web App

## Overview

This is a client-side React URL Shortener application built for the Carngus Hiring Evaluation. It allows users to shorten URLs, manage custom shortcodes, set expiry, and view analytics—all with robust logging via a custom LoggingMiddleware. The app uses Material UI for styling and runs entirely in the browser (no backend required).

## Features

- Shorten up to 5 URLs at once
- Optional custom shortcode and expiry (default 30 min)
- Unique shortcodes enforced
- Redirects handled client-side
- Statistics page with click analytics
- All logging via LoggingMiddleware (no console.log)
- Material UI for a modern, clean interface
- Data persisted in localStorage

## Folder Structure

```
12221499/
├── LoggingMiddleware/
│   └── log.js
├── FrontendTestSubmission/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── router.jsx
│       ├── components/
│       │   ├── URLForm.jsx
│       │   └── URLStats.jsx
│       ├── pages/
│       │   ├── ShortenPage.jsx
│       │   ├── StatsPage.jsx
│       │   └── RedirectPage.jsx
│       ├── services/
│       │   └── storage.js
│       ├── styles/
│       │   └── theme.js
│       └── utils/
│           └── validators.js
```

## Running the App

1. Install dependencies:
   ```bash
   cd FrontendTestSubmission
   npm install
   ```
2. Start the dev server on the required port:
   ```bash
   npm run dev -- --port 3000
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

## Notes

- All logging is handled by `LoggingMiddleware/log.js`.
- No user authentication is required.
- All data is stored in the browser (localStorage).
- Only Material UI and native CSS are used for styling.

## Evaluation

- URL shortener logic, analytics, and error handling are all client-side.
- The app is robust, user-friendly, and meets all requirements from the evaluation brief.
