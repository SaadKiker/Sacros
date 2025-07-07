import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import HomeScreen from "./screens/HomeScreen";
import FoodDatabaseScreen from "./screens/FoodDatabaseScreen";
import GoalsScreen from "./screens/GoalsScreen";
import { AppProvider, useAppContext } from "./context/AppContext";

// Loading component to show while data is being loaded
const LoadingIndicator = () => (
  <div className="loading-overlay">
    <div className="loading-spinner"></div>
    <p className="loading-text">Loading data...</p>
  </div>
);

// Main app content
const AppContent = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'database' | 'goals'>('home');
  const { isLoading } = useAppContext();

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <Router>
        <div className="app-container">
          <header className="app-header">
            <div className="app-logo">
              <svg className="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="36" height="36">
                {/* Simple chicken outline matching the provided image */}
                <path fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" 
                  d="M50,85 c0,-10 0,-15 0,-20
                    C30,60 15,45 25,25
                    C30,15 45,15 50,25
                    C55,15 70,15 75,25
                    C85,45 70,60 50,65
                    C50,70 50,75 50,85
                    M50,85 L40,95 M50,85 L60,95" />
              </svg>
              <h1>Sacros</h1>
            </div>
            <nav className="app-nav">
              <Link 
                to="/" 
                className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                Home
              </Link>
              <Link 
                to="/database" 
                className={`nav-link ${activeTab === 'database' ? 'active' : ''}`}
                onClick={() => setActiveTab('database')}
              >
                Food Database
              </Link>
              <Link 
                to="/goals" 
                className={`nav-link ${activeTab === 'goals' ? 'active' : ''}`}
                onClick={() => setActiveTab('goals')}
              >
                Goals
              </Link>
            </nav>
          </header>

          <main className="app-content">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/database" element={<FoodDatabaseScreen />} />
              <Route path="/goals" element={<GoalsScreen />} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
