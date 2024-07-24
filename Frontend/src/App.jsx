import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Group from './pages/Group';
import GroupInfo from './pages/GroupInfo';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Login />,
    },
    {
      path: '/signup',
      element: <Signup />,
    },
    {
      path: '/groups',
      element: <Group />,
    },
    {
      path: '/groupInfo',
      element: <GroupInfo />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
