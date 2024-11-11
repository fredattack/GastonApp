import React, { lazy } from 'react';

const Index = lazy(() => import('../pages/Index'));
const Pets = lazy(() => import('../pages/content/Pet/Pets'));
const PetForm = lazy(() => import('../pages/content/Pet/PetForm'));
const AccountSetting = lazy(() => import('../pages/content/Pet/AccountSetting'));

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
    {
        path: '/content/pets/create',
        element: <AccountSetting />,
        layout: 'default',
    },{
        path: '/content/pets/{id}',
        element: <PetForm />,
        layout: 'default',
    },
];

export { routes };
