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
import Register from "./pages/Register";
import Users from "./pages/Users";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Guest + User + Admin เข้าได้ */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/knowledge" element={<Knowledge />} />

        {/* User + Admin */}
        <Route
          path="/predict"
          element={
            <ProtectedRoute>
              <Predict />
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
          path="/articles"
          element={
            <ProtectedRoute>
              <Articles />
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/users"
          element={
            <ProtectedRoute role="admin">
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute role="admin">
              <Upload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/train"
          element={
            <ProtectedRoute role="admin">
              <Train />
            </ProtectedRoute>
          }
        />

        <Route
          path="/models"
          element={
            <ProtectedRoute role="admin">
              <Models />
            </ProtectedRoute>
          }
        />

        <Route
          path="/model-information"
          element={
            <ProtectedRoute role="admin">
              <ModelInformation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/training-history"
          element={
            <ProtectedRoute role="admin">
              <TrainingHistory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;