import { createBrowserRouter } from "react-router-dom";
import type { Router as RouterType } from "@remix-run/router";
import BlankLayout from "../components/Layouts/BlankLayout";
import DefaultLayout from "../components/Layouts/DefaultLayout";
import { routes } from "./routes";

const finalRoutes = routes.map((route) => {
    return {
        ...route,
        element:
            route.layout === "blank" ? (
                <BlankLayout>{route.element}</BlankLayout>
            ) : (
                <DefaultLayout>{route.element}</DefaultLayout>
            ),
    };
});

const router: RouterType = createBrowserRouter(finalRoutes);

export default router;
