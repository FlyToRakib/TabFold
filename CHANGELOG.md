# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-05-02
### Added
- **Centralized Link Management:** All outbound links (Review, More Tools, Privacy, Support) are now managed dynamically via `links.js` — no more hardcoded URLs in HTML.
- **Popup Session Saving:** Save sessions directly from the popup with a custom name input and one-click "Save Session" button.
- **Real-Time Session Sync:** Options page sessions list auto-refreshes when sessions are saved or deleted from the popup (no manual reload needed).
- **Global Header & Footer:** Consistent branded header (TabFold + POWERED BY DEGIRD) and footer with dynamic outbound links across popup and options pages.
- **Options Page Navigation:** Tabbed navigation (Settings / Sessions) with lime green active indicator and underline bar.
- **Privacy & Copyright:** Added Privacy link in options footer and © 2026 TABFOLD copyright line.

### Changed
- **UI Redesign:** Unified dark theme (`#111827`) across all pages — header, body, and footer backgrounds are now consistent.
- **Popup Layout:** Wider popup (400px). "Group by Domain" and "Suspend Inactive" buttons now share a row. "Save Session" is visually separated with a divider.
- **Gear Icon:** Replaced emoji with a lime green SVG icon with rotate-on-hover animation.
- **Keyboard Shortcut:** Changed from `Ctrl+Shift+E` to `Alt+Shift+F`. Removed `Ctrl+Shift+M` (Markdown export shortcut).
- **Session List Scroll:** First 3 sessions visible by default; scrolling starts after 3 items.
- **Options Header:** Fixed 70px height with sticky positioning.

### Removed
- Removed `export-markdown` keyboard shortcut command and its background handler.
- Removed hardcoded outbound links from HTML files.

## [1.0.0] - 2026-04-03
### Added
- **One-Click Domain Grouping:** Automatically organize scattered tabs into native Chrome Tab Groups based on their domain.
- **Auto-Suspend & Memory Saver:** Background timer to automatically suspend inactive tabs (with customizable time limits) to save RAM.
- **Domain Whitelist:** Ability to exempt specific domains (e.g., Spotify, Gmail) from auto-suspension.
- **Export/Import Engine:** Instantly copy all open URLs to the clipboard as Markdown, Plain Text, CSV, or HTML. "Paste & Open" reverse import functionality added.
- **Session Manager:** Save the current window's tabs as a named session and restore them later with one click.
- **Duplicate Destroyer:** One-click button to find and close tabs with identical URLs.
- **Smart Filters:** Toggles to target only the active window and to exclude pinned tabs from actions.
- **Keyboard Shortcut:** `Alt+Shift+F` (Open Menu).

### Changed
- Streamlined settings dashboard for a cleaner user experience.
- Updated UI color palette to feature neutral bases with high-contrast lime green hover states.
- Reordered Session lists to display the most recently saved sessions at the top.