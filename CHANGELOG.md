# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-02

### Added
- **Core Architecture:** Initialized Manifest V3 codebase with background service worker, popup UI, and options dashboard.
- **Domain Grouping Engine:** Added `groupTabsBtn` logic to parse tab URLs, sort by hostname, and bundle them into Chrome native Tab Groups with randomized colors.
- **Export/Import Module:** Implemented multi-format exporting (Markdown, Plain Text, CSV, HTML) directly to the user's clipboard.
- **Reverse Import:** Added regex-based URL parsing to allow users to paste text containing URLs and instantly open them in background tabs.
- **Memory Management:** - Added manual "Suspend Inactive" button utilizing `chrome.tabs.discard`.
  - Implemented `chrome.alarms` in `background.js` for automated tab suspension based on a user-defined inactivity threshold.
- **Duplicate Detection:** Added logic to iterate through active window tabs, identify matching URLs, and systematically close duplicates.
- **Session Saving:** Built local storage array management to save arrays of URLs and titles, allowing users to restore previous browsing sessions on demand.
- **Smart Filters:** Added global toggles for "Active Window Only" and "Exclude Pinned Tabs" that affect grouping, exporting, and suspension behaviors.
- **Whitelist System:** Implemented a domain whitelisting feature in the Options page to protect specific hostnames from auto-suspension.
- **UI/UX:** Designed a responsive popup and options page with a dark/light mode toggle based on standard `@media (prefers-color-scheme: dark)` CSS media queries. Added the primary brand palette (Dark Green `#002719` & Lime Green `#AEED22`).
- **Shortcuts:** Registered `Ctrl+Shift+E` for popup access and `Ctrl+Shift+M` for instant markdown export (via injected scripting to access the clipboard from the background worker).