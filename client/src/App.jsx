import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import './App.scss'

import { ProtectedRoute } from './ProtectedRoute';
import Login from "./Page/Login/Login.jsx";
import Dashboard from "./Page/Dashboard/Dashboard.jsx";


function App() {
    const routes = [
        {
            link: '/login',
            element: <Login />,
        },
        {
            link: '/',
            element: <ProtectedRoute element={<Dashboard />} />,
        }
    ];

    return (
        <>
            <Routes>
                {routes.map(route => (
                    <Route
                        key={route.link}
                        path={route.link}
                        element={
                            <Suspense >
                                {route.element}
                            </Suspense>
                        }
                    />
                ))}
            </Routes>
        </>
    );
}

export default App;
