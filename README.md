# 📂 TabFold

**A powerful, one-click tab management tool that organizes, exports, and suspends tabs to save memory and keep you focused.**

Tab overload kills focus and bloats browser memory usage. TabFold is a lightweight, strictly native Manifest V3 extension designed to help you organize scattered tabs, save browsing sessions, and share multiple links cleanly without the bloat of heavy extensions.

## ✨ Features

* **One-Click Domain Grouping:** Automatically gather scattered tabs from the same website into Chrome's native Tab Groups with customized colors.
* **Robust Export & Import:** Instantly copy all open tabs to your clipboard in Markdown (`[Title](URL)`), Plain Text, CSV, or HTML. 
* **Reverse Import:** Paste a list of URLs directly into TabFold to instantly open them in the background.
* **Memory Saver & Auto-Suspend:** Instantly discard inactive tabs to free up RAM. Set up an Auto-Suspend Timer to automatically put tabs to sleep after a set period of inactivity.
* **Session Management:** Save the current state of your window and restore that exact group of tabs later with a single click.
* **Duplicate Destroyer:** Automatically detect and close duplicate tabs with the exact same URL.
* **Smart Filters & Whitelisting:** Exclude pinned tabs, target only the active window, and whitelist specific domains (like Spotify or Gmail) so they are never suspended.
* **Keyboard Shortcuts:** Built-in shortcut support (e.g., `Ctrl+Shift+M` / `Cmd+Shift+M` to instantly export the active window's tabs to Markdown).

## 🚀 Installation (Developer Mode)

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle switch in the top right corner.
4. Click the **Load unpacked** button in the top left.
5. Select the directory where you saved the TabFold files.
6. Pin TabFold to your toolbar for easy access!

## ⌨️ Keyboard Shortcuts

* **Open TabFold:** `Ctrl+Shift+E` (Mac: `Cmd+Shift+E`)
* **Quick Markdown Export:** `Ctrl+Shift+M` (Mac: `Cmd+Shift+M`)
*(Shortcuts can be customized in Chrome via `chrome://extensions/shortcuts`)*

## 🛠️ Built With
* Manifest V3
* Vanilla JavaScript
* HTML5 / CSS3 (CSS Variables for Light/Dark Mode)
* Chrome Extension APIs (`tabs`, `tabGroups`, `storage`, `alarms`, `scripting`)