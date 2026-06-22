import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TestReport from "./pages/TestReport";
import Analytics from "./pages/Analytics"
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/runs/:runId" element={<TestReport />} />
      <Route path="/projects/:projectId/analytics" element={<Analytics />} />
      <Route path="/projects/:projectId/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
