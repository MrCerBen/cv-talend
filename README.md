# CV Pipeline Talend

An interactive resume that builds itself on screen, section by section, driven by a real **Talend** job — like a small ETL pipeline whose output is the resume itself.

![CV Pipeline screenshot](./assets/screenshot.png)

## Why

A traditional resume is a static document — the reader has to take the listed skills on faith. This project takes a different approach for a Talend / Data profile: instead of *writing* "I know how to build data pipelines," it *builds one*, live, in front of the reader.

A Talend job orchestrates 5 steps (initialization → profile → skills → experience → finalization), writing its progress to a small file. A web page picks up that signal and reveals each resume section in turn — no server, no backend, no framework, just Talend and a browser talking to each other through a single file.

## Live demo

No installation needed — just open `WEB/index.html` directly in your browser (double-click, works offline) and click **"Full Overview"** to see the whole resume immediately.

Hosted demo: **[link to be added]**

## How it works

```
Talend Job  --writes-->  RUNTIME/progress.js  --read every 500ms-->  Web Page
(tLoop + tJavaFlex)         (JSONP file)              (<script> tag, no fetch, no CORS)
```

- **`DATA/`** — the resume content, as plain JavaScript files (`profile.js`, `skills.js`, `experiences.js`, `education.js`). This is the only place to edit to customize the CV.
- **`WEB/`** — the page itself (`index.html`, `css/style.css`, `js/app.js`). Loads `DATA/` via `<script>` tags — no `fetch()`, so it works both offline (`file://`) and once hosted online, with zero configuration difference.
- **`RUNTIME/`** — `progress.js`, rewritten by the Talend job at every step.
- **`TALEND/`** — the exact code for each job component, plus a full wiring guide (`JOB_CONSTRUCTION.txt`) and a ready-to-import job export.
- **`CV/`** — example PDF exports and a downloadable pack, wired to the page's "Downloads" section.

## Getting started

1. Clone or download this repo.
2. Open `WEB/index.html` — that's the whole "no dependencies" experience.
3. To drive it with a real Talend job: open **Talend Open Studio** (free Community edition) and follow `TALEND/JOB_CONSTRUCTION.txt`, or the full step-by-step guide in `DOCUMENTATION/`.
4. Replace the content of `DATA/*.js` with your own resume — no other file needs to change.

## Documentation

Two companion documents (PDF + Word), in `DOCUMENTATION/`:

- 📘 **Build Guide** — full step-by-step walkthrough: architecture, data files, the web page, every Talend component with its code, and a verification checklist.
- 📐 **Architecture Note** — the reasoning behind the technical choices (why `.js` files instead of JSON, why polling instead of a websocket, why the pause button doesn't stop the actual job, and more), plus known limitations, written for a technical reader.

## Design

Editorial look, cream & terracotta palette, serif headings — built to read like an actual resume rather than a developer console. Fully driven by CSS custom values documented in the Build Guide, easy to re-theme.

## License

Feel free to fork, strip out the example data in `DATA/`, and make it your own.

---

Built as a way to demonstrate, in practice, skills that are otherwise just listed on a CV: process orchestration, separation of data / logic / presentation, and a bit of front-end polish along the way.
