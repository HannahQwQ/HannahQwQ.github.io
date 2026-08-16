import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import Mailbox from './views/Mailbox';
import About from './views/InfoPage/About';
import Contact from './views/InfoPage/Contact';
import Project from './views/InfoPage/Project';

function App() {
  return (
    <Router>
      <div className="app-viewport">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/world" element={<Home />} />
          <Route path="/mailbox" element={<Mailbox />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/project/:id" element={<Project />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
