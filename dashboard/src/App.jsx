import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import dashboardRoutes from './routes/dashboard';
import Spinner from './pages/Dashboard/component/Spinner';
import "./App.css";

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
      </Routes>
    </Suspense>
  );
}

export default App;
