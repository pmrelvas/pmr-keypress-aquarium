# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A vanilla HTML/CSS/JS browser app (no build step, no framework, no package manager). The entry point is `index.html`, which loads `styles.css` and `script.js`. Static assets go in `assets/`.

## Running the project

Open `index.html` directly in a browser, or serve it with any static file server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Architecture

Single-page, no modules, no bundler. All JS lives in `script.js` and all styles in `styles.css`. Keep everything in these three files unless a clear need to split arises.
