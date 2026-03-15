import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DataExplorer from './pages/DataExplorer';
import Visualize from './pages/Visualize';
import Predict from './pages/Predict';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/data" element={<DataExplorer />} />
          <Route path="/visualize" element={<Visualize />} />
          <Route path="/predict" element={<Predict />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
