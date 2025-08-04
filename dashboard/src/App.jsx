import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import dashboardRoutes from './routes/dashboard';
import Spinner from './pages/Dashboard/component/Spinner';
import "./App.css";
import Editor from './pages/Editor/EditorPage';
// import Webpage from './pages/editor/Components/Webpage';

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />}>
          {dashboardRoutes.map(({ path, element }, i) => (
            <Route key={i} path={path} element={element} />
          ))}
        </Route>
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </Suspense>
  );
}

export default App;
