import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CropRecommendation from './pages/CropRecommendation';
import PriceForecast from './pages/PriceForecast';
import PricePrediction from './pages/PricePrediction';
import Diagnosis from './pages/Diagnosis';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  // If user is authenticated render children, otherwise redirect to login
  // return isAuthenticated ? children : <Navigate to="/login" />;
  return children;
};

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
              path="/signup"
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recommend"
              element={
                <ProtectedRoute>
                  <CropRecommendation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forecast"
              element={
                <ProtectedRoute>
                  <PriceForecast />
                </ProtectedRoute>
              }
            />
            <Route
              path="/price-prediction"
              element={
                <ProtectedRoute>
                  <PricePrediction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/diagnose"
              element={
                <ProtectedRoute>
                  <Diagnosis />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
