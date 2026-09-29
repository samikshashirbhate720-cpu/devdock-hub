# DevDock Hub

Build a single-page developer hub ("Dockyard").

What's on the page:
- Hero: headline plus an interactive live code sample with JavaScript, Python, and cURL tabs and a working Copy button.
- Four starting points: Quickstart, API reference, SDKs, and Sample apps. The last three jump to the library with that filter already applied.
- Searchable library: live text search plus type filters. Pressing '/' anywhere on the page jumps focus to the search box.
- Changelog: timeline with "New" and "Breaking" badges.
- Community and status: a live status indicator at the top, and a "Stuck? Ask a human" block with support stats.
- Extras: light/dark toggle, responsive mobile layout, keyboard focus outlines, and reduced-motion support.
- Design choices: blueprint-paper aesthetic with a faint grid background, cobalt blue primary, highlighter-yellow accent, and chunky offset shadows on buttons and code windows. Typography: Bricolage Grotesque for headlines, IBM Plex Sans for body, and JetBrains Mono for code.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7cad8f37-2f30-4b7c-98fb-68e3b686120a).

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
