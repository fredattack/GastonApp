import React, { lazy } from "react";

const Index = lazy(() => import("../pages/Index"));
// @ts-ignore
const Pets = lazy(() => import("../pages/content/Pet/Pets"));
const PetForm = lazy(() => import("../pages/content/Pet/ThePetFormPage"));
const AIAssistant = lazy(() => import("../pages/AIAssistant/AIAssistantPage"));

const routes = [
    // dashboard
    {
        path: "/",
        element: <Index />,
        layout: "default",
    },
    // AI Assistant
    {
        path: "/ai-assistant",
        element: <AIAssistant />,
        layout: "blank",
    },
    // content
    {
        path: "/content/pets",
        element: <Pets />,
        layout: "default",
    },
    {
        path: "/content/pets/create",
        element: <PetForm pet={undefined} />,
        layout: "default",
    },
    {
        path: "/content/pets/:id",
        element: <PetForm pet={undefined} />,
        layout: "default",
    },
];

export { routes };
