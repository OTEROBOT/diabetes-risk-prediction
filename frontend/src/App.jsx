// frontend/src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Predict from "./pages/Predict";
import Train from "./pages/Train";
import Models from "./pages/Models";
import TrainingHistory from "./pages/TrainingHistory";
import PredictionHistory from "./pages/PredictionHistory";
import Upload from "./pages/Upload";
import ModelInformation from "./pages/ModelInformation";
import Articles from "./pages/Articles";
import Knowledge from "./pages/Knowledge";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/knowledge" element={<Knowledge />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/predict"
          element={
            <ProtectedRoute>
              <Predict />
            </ProtectedRoute>
          }
        />

        <Route
          path="/train"
          element={
            <ProtectedRoute>
              <Train />
            </ProtectedRoute>
          }
        />

        <Route
          path="/models"
          element={
            <ProtectedRoute>
              <Models />
            </ProtectedRoute>
          }
        />

        <Route
          path="/training-history"
          element={
            <ProtectedRoute>
              <TrainingHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prediction-history"
          element={
            <ProtectedRoute>
              <PredictionHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/model-information"
          element={
            <ProtectedRoute>
              <ModelInformation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/articles"
          element={
            <ProtectedRoute>
              <Articles />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;