# StreamSavvy - The Ultimate Video Streaming Platform

![StreamSavvy Banner](https://via.placeholder.com/1200x400?text=StreamSavvy+Preview)

**StreamSavvy** is a modern, responsive video streaming application built with **React** and **Vite**. It offers a Netflix-like user experience where users can browse, search, and watch video content categorized by genres. The project utilizes a mock backend (`db.json`) to simulate API responses for dynamic content loading.

## 🚀 Features

* **Responsive UI**: Seamless viewing experience across Desktop, Tablet, and Mobile.
* **Hero Section**: Dynamic trending content banner with playback controls.
* **Content Library**: Categorized rows (Trending, Action, Comedy, etc.) sourced from a database.
* **Video Playback**: Integrated video player with play, pause, and volume controls.
* **Search Functionality**: Real-time filtering to find movies or shows instantly.
* **Mock Backend**: Uses `db.json` to simulate REST API endpoints for user data and video metadata.

## 🛠️ Tech Stack

* **Frontend Framework**: [React.js](https://react.dev/)
* **Build Tool**: [Vite](https://vitejs.dev/) (High-performance build & HMR)
* **Styling**: CSS / Styled Components (Responsive Design)
* **Data Simulation**: JSON Server / Local `db.json`
* **State Management**: React Hooks (`useState`, `useEffect`)

## 📂 Project Structure

```bash
StreamSavvy/
├── public/              # Static assets (favicons, images)
├── src/
│   ├── components/      # Reusable UI components (Navbar, Row, Banner)
│   ├── pages/           # Main application pages (Home, Player)
│   ├── App.jsx          # Main application entry point
│   ├── main.jsx         # DOM rendering
│   └── index.css        # Global styles
├── db.json              # Mock database containing video metadata
├── package.json         # Project dependencies and scripts
└── vite.config.js       # Vite configuration settings
