import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Start from './views/Start';
import Avatar from './views/Avatar';
import World from './views/World';
import Mailbox from './views/Mailbox';
import About from './views/InfoPage/About';
import Contact from './views/InfoPage/Contact';
import Project from './views/InfoPage/Project';

function App() {
  return (
    <Router>
      <div className="app-viewport">
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/avatar" element={<Avatar />} />
          <Route path="/world" element={<World />} />
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
