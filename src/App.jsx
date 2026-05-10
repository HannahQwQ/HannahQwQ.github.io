import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import Mailbox from './views/Mailbox';
import AdminPanel from './views/AdminPanel';

function App() {
  return (
    <Router>
      <div className="app-viewport">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mailbox" element={<Mailbox />} />
          <Route path="/hannah-secret-dashboard-2026" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;