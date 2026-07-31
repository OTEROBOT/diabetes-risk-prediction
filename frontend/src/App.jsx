// D:\IT29401 โครงงานทางเทคโนโลยีสารสนเทศ\ปี4เทอม1\diabetes-risk-prediction\frontend\src\App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Predict from "./pages/Predict";
import Train from "./pages/Train";
import Models from "./pages/Models";
import TrainingHistory from "./pages/TrainingHistory";
import PredictionHistory from "./pages/PredictionHistory";
import Upload from "./pages/Upload";
import ModelInformation from "./pages/ModelInformation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/train" element={<Train />} />
        <Route path="/models" element={<Models />} />
        <Route path="/training-history" element={<TrainingHistory />} />
        <Route path="/prediction-history" element={<PredictionHistory />} />
        <Route path="/model-information" element={<ModelInformation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;