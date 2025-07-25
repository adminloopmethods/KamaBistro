import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard/welcome/Dashboard';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/editing" element={<Editing />} /> */}
      {/* <Route path="/editing/website" element={<Webpage />} /> */}
    </Routes>
  );
}

export default App;
