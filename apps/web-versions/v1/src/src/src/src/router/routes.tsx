import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const Index = lazy(() => import("../pages/Index"));
const ComponentsShowcase = lazy(() => import("../pages/ComponentsShowcase"));
// @ts-ignore
const Pets = lazy(() => import("../pages/content/Pet/Pets"));
const PetForm = lazy(() => import("../pages/content/Pet/ThePetFormPage"));
const AIAssistant = lazy(() => import("../pages/AIAssistant/AIAssistantPage"));
const EventCalendar = lazy(() => import("../components/Event/list/EventCalendar"));
const FeedingDashboard = lazy(() => import("../pages/content/Feeding/FeedingDashboardPage"));
const LoginPage = lazy(() => import("../pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/Auth/RegisterPage"));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg
          width="64"
          height="64"
          viewBox="0 0 135 135"
          xmlns="http://www.w3.org/2000/svg"
          fill="#4361ee"
        >
          <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 67 67"
              to="-360 67 67"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

const routes = [
    // auth
    {
        path: "/login",
        element: <LoginPage />,
        layout: "auth",
    },
    {
        path: "/register",
        element: <RegisterPage />,
        layout: "auth",
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
