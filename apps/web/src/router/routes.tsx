import React, { lazy } from "react";
import { ProtectedRoute } from "../components/Router/ProtectedRoute";

const Index = lazy(() => import("../pages/Index"));
const ComponentsShowcase = lazy(() => import("../pages/ComponentsShowcase"));
const LoginPage = lazy(() => import("../pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/Auth/RegisterPage"));
// @ts-ignore
const Pets = lazy(() => import("../pages/content/Pet/Pets"));
const PetForm = lazy(() => import("../pages/content/Pet/ThePetFormPage"));
const AIAssistant = lazy(() => import("../pages/AIAssistant/AIAssistantPage"));
const EventCalendar = lazy(() => import("../components/Event/list/EventCalendar"));
const FeedingDashboard = lazy(() => import("../pages/content/Feeding/FeedingDashboardPage"));

const routes = [
    // auth
    {
        path: "/login",
        element: <LoginPage />,
        layout: "blank",
    },
    {
        path: "/register",
        element: <RegisterPage />,
        layout: "blank",
    },
    // dashboard
    {
        path: "/",
        element: <ProtectedRoute><Index /></ProtectedRoute>,
        layout: "default",
    },
    // Components Showcase
    {
        path: "/components-showcase",
        element: <ProtectedRoute><ComponentsShowcase /></ProtectedRoute>,
        layout: "default",
    },
    // AI Assistant
    {
        path: "/ai-assistant",
        element: <ProtectedRoute><AIAssistant /></ProtectedRoute>,
        layout: "blank",
    },
    // feeding dashboard
    {
        path: "/feeding",
        element: <ProtectedRoute><FeedingDashboard /></ProtectedRoute>,
        layout: "default",
    },
    // calendar
    {
        path: "/calendar",
        element: <ProtectedRoute><EventCalendar /></ProtectedRoute>,
        layout: "default",
    },
    // content
    {
        path: "/content/pets",
        element: <ProtectedRoute><Pets /></ProtectedRoute>,
        layout: "default",
    },
    {
        path: "/content/pets/create",
        element: <ProtectedRoute><PetForm pet={undefined} /></ProtectedRoute>,
        layout: "default",
    },
    {
        path: "/content/pets/:id",
        element: <ProtectedRoute><PetForm pet={undefined} /></ProtectedRoute>,
        layout: "default",
    },
];

export { routes };
