import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { AdminView } from "./views/AdminView";
import { CollectorView } from "./views/CollectorView";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: AdminView },
      { path: "collector", Component: CollectorView },
    ],
  },
]);
