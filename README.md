# Antigravity Terminal UI 🚀

A beautiful, custom glassmorphic Web UI wrapper to interact with the Antigravity CLI (`agy`). Built with Next.js, React, xterm.js, and node-pty.

## Architecture

This application consists of two main components running together:

1. **PTY Bridge Backend (`pty-server.js`)**:
   - Spawns the `agy` process as a pseudo-terminal using `node-pty` under the hood.
   - Sets up a WebSocket server (`ws`) on port `3001`.
   - Pipes terminal keystrokes/inputs from the frontend straight into the PTY process, and pipes the output stream back to the browser in real-time.
   - Listens for window resize events and propagates column/row changes to the PTY process.

2. **Terminal Frontend (`src/app/page.js`)**:
   - Renders a terminal emulator in the browser using `xterm.js` and `@xterm/addon-fit`.
   - Connects to the backend via WebSockets.
   - Styled with a sleek, premium dark-mode glassmorphism design. Includes custom background animated radial gradient blobs, macOS window buttons, real-time connection status pill, and utility buttons (Clear, Fullscreen, Reconnect).
   - Features a **Quick Execution** sidebar that allows you to trigger common commands (like help or version check) with a single click.

---

## Getting Started

### 1. Prerequisites

Make sure you have [Antigravity CLI](file:///Users/lokeshchoudhary/.local/bin/agy) (`agy`) installed on your system. You can verify it by running `agy --version` in your native terminal.

### 2. Installation

All dependencies (like `node-pty`, `ws`, `express`, `xterm.js`, and `concurrently`) are already installed. If you ever need to clean install:

```bash
npm install
```

### 3. Run the Development Environment

Start both the PTY Bridge backend and Next.js frontend concurrently:

```bash
npm run dev
```

This will spin up:
- PTY Bridge WebSocket Server on [http://localhost:3001](http://localhost:3001)
- Next.js Web App on [http://localhost:3000](http://localhost:3000)

### 4. Use the Dashboard

Open [http://localhost:3000](http://localhost:3000) in your browser. You will be greeted with the beautiful, glassmorphic terminal dashboard. 

---

## Custom Styling & Resizing

- **Glassmorphic UI**: Defined in [globals.css](file:///Users/lokeshchoudhary/eksaq/scripts/terminal-ui/src/app/globals.css) using `backdrop-filter: blur(24px)` and custom borders/shadows.
- **Background Animations**: Three glowing, color-shifting blobs float smoothly in the background.
- **Dynamic Resizing**: The terminal uses a `ResizeObserver` on the terminal container. Any change in window size or sidebars instantly triggers the fit-addon to resize xterm.js, sending the new row/column dimensions to the backend PTY so it stays fully aligned.
