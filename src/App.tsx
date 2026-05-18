import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StoryPlayer from './pages/StoryPlayer';
import './components/Particles.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-red-500/30">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/story/:id" element={<StoryPlayer />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
