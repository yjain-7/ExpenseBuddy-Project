import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GroupInfo from './pages/GroupInfo';
import UserInfo from './pages/UserInfo';

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
      path: '/userInfo',
      element: <UserInfo />,
    },
    {
      path: '/groupInfo',
      element: <GroupInfo />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
