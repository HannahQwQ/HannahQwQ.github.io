import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
// 假设你已经创建了 Mailbox 页面组件
const Mailbox = () => <div style={{ padding: '20px' }}>这是匿名信箱页面</div>;

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