import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing.jsx";
import StoryExplorer from "./components/StoryExplorer.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/explore" element={<StoryExplorer />} />
      </Routes>
    </Router>
  );
}

