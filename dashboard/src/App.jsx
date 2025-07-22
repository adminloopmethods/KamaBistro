import { Routes, Route } from 'react-router-dom';
import Login from './Components/Dashboard/auth/Login';
import Dashboard from './Components/Dashboard/welcome/Dashboard';
// import Editing from './components/Editing';
// import Webpage from './components/Webpage';

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
