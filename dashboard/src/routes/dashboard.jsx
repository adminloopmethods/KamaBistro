// src/routes/dashboard.js
import { lazy } from 'react';

const Welcome = lazy(() => import('../pages/Dashboard/Welcome'));
const Analytics = lazy(() => import('../pages/Dashboard/Analystics'));
const Pages = lazy(() => import('../pages/Dashboard/Pages'));
const Users = lazy(() => import('../pages/Dashboard/Users'));
const Overview = lazy(() => import('../pages/Dashboard/Overview'));
const LogsPage = lazy(() => import('../pages/Dashboard/Logs'));

const dashboardRoutes = [
  { path: "", element: <Welcome /> },         // / (index route)
  { path: "overview", element: <Overview /> },
  { path: "analytics", element: <Analytics /> },
  { path: "pages", element: <Pages /> },
  { path: "users", element: <Users /> },
  { path: "logs", element: <LogsPage /> },
];

export default dashboardRoutes;
