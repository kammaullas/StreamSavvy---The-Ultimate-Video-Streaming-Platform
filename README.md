# StreamSavvy - The Ultimate Video Streaming Platform


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
```
---

## ⚡ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v14 or higher)
* npm (Node Package Manager)

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/kammaullas/StreamSavvy---The-Ultimate-Video-Streaming-Platform.git](https://github.com/kammaullas/StreamSavvy---The-Ultimate-Video-Streaming-Platform.git)
    cd StreamSavvy---The-Ultimate-Video-Streaming-Platform
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start the Development Server**
    ```bash
    npm run dev
    ```

4.  **Start the Mock Backend (Optional)**
    If the app requires the JSON server to be running separately to fetch data:
    ```bash
    npx json-server --watch db.json --port 3000
    ```

5.  **View the App**
    Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<br />

 your browser and navigate to http://localhost:5173 (or the port shown in your terminal).
