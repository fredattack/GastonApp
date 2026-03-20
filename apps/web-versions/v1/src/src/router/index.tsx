import { createBrowserRouter } from "react-router-dom";
import type { Router } from "@remix-run/router";
import BlankLayout from "../components/Layouts/BlankLayout";
import DefaultLayout from "../components/Layouts/DefaultLayout";
import AuthLayout from "../components/Layouts/AuthLayout";
import { routes } from "./routes";

const finalRoutes = routes.map((route) => {
    return {
        ...route,
        element:
            route.layout === "auth" ? (
                <AuthLayout>{route.element}</AuthLayout>
            ) : route.layout === "blank" ? (
                <BlankLayout>{route.element}</BlankLayout>
            ) : (
                <DefaultLayout>{route.element}</DefaultLayout>
            ),
    };
});

const router: Router = createBrowserRouter(finalRoutes);

export default router;
