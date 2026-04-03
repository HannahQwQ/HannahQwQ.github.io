import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import Mailbox from './views/Mailbox';

function App() {
  return (
    <Router>
      <div className="app-viewport">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mailbox" element={<Mailbox />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;