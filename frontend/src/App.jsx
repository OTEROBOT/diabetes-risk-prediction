import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Predict from "./pages/Predict";
import Train from "./pages/Train";
import Models from "./pages/Models";
import TrainingHistory from "./pages/TrainingHistory";
import PredictionHistory from "./pages/PredictionHistory";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/predict"
          element={<Predict />}
        />

        <Route
          path="/train"
          element={<Train />}
        />

        <Route
          path="/models"
          element={<Models />}
        />

        <Route
          path="/training-history"
          element={<TrainingHistory />}
        />

        <Route
          path="/prediction-history"
          element={<PredictionHistory />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;