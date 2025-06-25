## Author

**Aahan Goswami**

# Collaborative Whiteboard Application (Frontend)

This project is the **frontend** for a real-time collaborative whiteboard application, built with [Create React App](https://github.com/facebook/create-react-app).  
It allows users to draw, write, and collaborate on canvases in real time, with authentication and sharing features.

---

## Features

- **User Authentication:** Register, login, and secure your sessions with JWT.
- **Profile Management:** View your profile and all canvases you own or that are shared with you.
- **Create & Manage Canvases:** Create new canvases, open existing ones, and see creation/update times.
- **Real-Time Collaboration:** Multiple users can draw and edit the same canvas simultaneously. All changes are synced instantly.
- **Drawing Tools:**
  - Brush (freehand)
  - Line
  - Rectangle
  - Circle
  - Arrow
  - Text
  - Eraser
- **Customizable Toolbox:** Change stroke color, fill color, and size for each tool.
- **Undo/Redo:** Step backward and forward through your drawing history.
- **Canvas Sharing:** Share your canvas with other users by email.
- **Responsive UI:** Works well on desktop browsers.
- **Persistent Sessions:** Stay logged in across refreshes and browser tabs.

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

1. **Clone the repository:**

   ```sh
   git clone <your-repo-url>
   cd whiteboardapplication1/frontend/whiteboard-tutorial-frontend1
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Start the development server:**
   ```sh
   npm start
   ```
   The app will run at [http://localhost:3000](http://localhost:3000).

---

## Usage

- **Login/Register:**  
  Visit `/login` to sign in or create a new account.
- **Profile:**  
  After login, you'll be redirected to your profile page where you can create new canvases or open existing ones.
- **Canvas:**  
  Open a canvas to start drawing. All changes are synced in real time with other users on the same canvas.
- **Share:**  
  Use the "Share" button on a canvas card in your profile to invite others by email.
- **Undo/Redo:**  
  Use keyboard shortcuts (`Ctrl+Z`/`Ctrl+Y`) or UI buttons (if present).

---

## Project Structure

- `src/pages/`
  - `login.js` – Login and registration page
  - `profile.js` – User profile and canvas management
  - `CanvasPage.js` – Main collaborative whiteboard page
- `src/components/`
  - `Board/` – Canvas drawing and rendering logic
  - `Toolbar.js`, `Toolbox.js` – Drawing tools and options
- `src/store/`
  - `BoardProvider.js`, `ToolboxProvider.js` – Context providers for state management
  - `board-context.js`, `toolbox-context.js` – React contexts
- `src/utils/api.js` – API helpers for backend communication
- `src/App.js` – Routing and main app entry

---

## API & Backend

- The frontend expects the backend to run at `http://localhost:3031`.
- All API and socket requests require a valid JWT token (stored in `localStorage` after login).
- For backend setup, see the backend README.

---

## Available Scripts

In the project directory, you can run:

- `npm start`  
  Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

- `npm test`  
  Launches the test runner in interactive watch mode.

- `npm run build`  
  Builds the app for production to the `build` folder.

- `npm run eject`  
  **Note:** This is a one-way operation. Once you eject, you can’t go back!

---

## Troubleshooting

- If you see "Loading canvas..." stuck, ensure your backend is running and accessible at `http://localhost:3031`.
- If you get "Unauthorized" errors, try logging in again.
- For real-time sync, make sure both frontend and backend are running and the socket connection is established.

---

## Learn More

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)

---
