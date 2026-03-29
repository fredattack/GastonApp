import React, { lazy } from "react";
import { ProtectedRoute } from "../components/Router/ProtectedRoute";
import ErrorBoundary from "../components/ErrorBoundary";
import { AIAssistantProvider } from "../contexts/AIAssistantContext";

const Index = lazy(() => import("../pages/Index"));
const ComponentsShowcase = lazy(() => import("../pages/ComponentsShowcase"));
const LoginPage = lazy(() => import("../pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/Auth/RegisterPage"));
// @ts-ignore
const Pets = lazy(() => import("../pages/content/Pet/Pets"));
const PetForm = lazy(() => import("../pages/content/Pet/ThePetFormPage"));
const AIAssistant = lazy(() => import("../pages/AIAssistant/AIAssistantPage"));
const EventCalendar = lazy(
    () => import("../components/Event/list/EventCalendar"),
);
const FeedingDashboard = lazy(
    () => import("../pages/content/Feeding/FeedingDashboardPage"),
);
const Onboarding = lazy(() => import("../pages/Onboarding"));
const Profile = lazy(() => import("../pages/Profile"));
const TermsOfService = lazy(() => import("../pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));

const routes = [
    // auth
    {
        path: "/login",
        element: (
            <ErrorBoundary>
                <LoginPage />
            </ErrorBoundary>
        ),
        layout: "blank",
    },
    {
        path: "/register",
        element: (
            <ErrorBoundary>
                <RegisterPage />
            </ErrorBoundary>
        ),
        layout: "blank",
    },
    // legal (public, no auth required)
    {
        path: "/cgu",
        element: (
            <ErrorBoundary>
                <TermsOfService />
            </ErrorBoundary>
        ),
        layout: "blank",
    },
    {
        path: "/privacy",
        element: (
            <ErrorBoundary>
                <PrivacyPolicy />
            </ErrorBoundary>
        ),
        layout: "blank",
    },
    // onboarding
    {
        path: "/onboarding",
        element: (
            <ProtectedRoute>
                <ErrorBoundary>
                    <Onboarding />
                </ErrorBoundary>
            </ProtectedRoute>
        ),
        layout: "blank",
    },
    // dashboard
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <ErrorBoundary>
                    <Index />
                </ErrorBoundary>
            </ProtectedRoute>
        ),
        layout: "default",
    },
    // Components Showcase
    {
        path: "/components-showcase",
        element: (
            <ProtectedRoute>
                <ErrorBoundary>
                    <ComponentsShowcase />
                </ErrorBoundary>
            </ProtectedRoute>
        ),
        layout: "default",
    },
    // AI Assistant
    {
        path: "/ai-assistant",
        element: (
            <ProtectedRoute>
                <AIAssistantProvider>
                    <ErrorBoundary>
                        <AIAssistant />
                    </ErrorBoundary>
                </AIAssistantProvider>
            </ProtectedRoute>
        ),
        layout: "blank",
    },
    // feeding dashboard
    {
        path: "/feeding",
        element: (
            <ProtectedRoute>
                <ErrorBoundary>
                    <FeedingDashboard />
                </ErrorBoundary>
            </ProtectedRoute>
        ),
        layout: "default",
    },
    // calendar
    {
        path: "/calendar",
        element: (
            <ProtectedRoute>
                <ErrorBoundary>
                    <EventCalendar />
                </ErrorBoundary>
            </ProtectedRoute>
        ),
        layout: "default",
    },
    // profile
    {
        path: "/profile",
        element: (
            <ProtectedRoute>
                <ErrorBoundary>
                    <Profile />
                </ErrorBoundary>
            </ProtectedRoute>
        ),
        layout: "default",
    },
    // content
    {
        path: "/content/pets",
        element: (
            <ProtectedRoute>
                <ErrorBoundary>
                    <Pets />
                </ErrorBoundary>
            </ProtectedRoute>
        ),
        layout: "default",
    },
    {
        path: "/content/pets/create",
        element: (
            <ProtectedRoute>
                <ErrorBoundary>
                    <PetForm pet={undefined} />
                </ErrorBoundary>
            </ProtectedRoute>
        ),
        layout: "default",
    },
    {
        path: "/content/pets/:id",
        element: (
            <ProtectedRoute>
                <ErrorBoundary>
                    <PetForm pet={undefined} />
                </ErrorBoundary>
            </ProtectedRoute>
        ),
        layout: "default",
    },
];

export { routes };
