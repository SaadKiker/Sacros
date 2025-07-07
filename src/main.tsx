import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initializeStorage } from "./storage/storageService";

// Initialize storage before rendering the app
const init = async () => {
  try {
    // Initialize storage
    await initializeStorage();
    
    // Render the app
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  } catch (error) {
    console.error("Error during initialization:", error);
    
    // Render the app anyway to avoid a blank screen
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  }
};

// Start initialization
init();
