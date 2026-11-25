import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './layouts/root-layout';
import { DashboardPage } from './pages/dashboard/dashboard-page';


export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
        
        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);

export default router;
