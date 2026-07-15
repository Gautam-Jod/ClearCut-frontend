import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Result from './pages/Result';
import History from './pages/History';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"           element={<Dashboard />} />
        <Route path="/upload"     element={<Upload />} />
        <Route path="/result/:id" element={<Result />} />
        <Route path="/history"    element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}
