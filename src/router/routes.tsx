import { lazy } from 'react';

const Index = lazy(() => import('../pages/Index'));
const Pets = lazy(() => import('../pages/content/Pets'));

const routes = [
    // dashboard
    {
        path: '/',
        element: <Index />,
        layout: 'default',
    },
    // content
    {
        path: '/content/pets',
        element: <Pets />,
        layout: 'default',
    },
];

export { routes };
