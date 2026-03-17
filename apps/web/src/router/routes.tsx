import React, { lazy } from "react";

const Index = lazy(() => import("../pages/Index"));
const ComponentsShowcase = lazy(() => import("../pages/ComponentsShowcase"));
// @ts-ignore
const Pets = lazy(() => import("../pages/content/Pet/Pets"));
const PetForm = lazy(() => import("../pages/content/Pet/ThePetFormPage"));
const AIAssistant = lazy(() => import("../pages/AIAssistant/AIAssistantPage"));
const EventCalendar = lazy(() => import("../components/Event/list/EventCalendar"));
const FeedingDashboard = lazy(() => import("../pages/content/Feeding/FeedingDashboardPage"));

const routes = [
    // dashboard
    {
        path: "/",
        element: <Index />,
        layout: "default",
    },
    // Components Showcase
    {
        path: "/components-showcase",
        element: <ComponentsShowcase />,
        layout: "default",
    },
    // AI Assistant
    {
        path: "/ai-assistant",
        element: <AIAssistant />,
        layout: "blank",
    },
    // feeding dashboard
    {
        path: "/feeding",
        element: <FeedingDashboard />,
        layout: "default",
    },
    // calendar
    {
        path: "/calendar",
        element: <EventCalendar />,
        layout: "default",
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
