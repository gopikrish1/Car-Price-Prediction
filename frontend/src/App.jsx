import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dataset from "./pages/Dataset";
import Visualizations from "./pages/Visualizations";
import Predict from "./pages/Predict";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dataset" element={<Dataset />} />
          <Route path="/visualizations" element={<Visualizations />} />
          <Route path="/predict" element={<Predict />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
