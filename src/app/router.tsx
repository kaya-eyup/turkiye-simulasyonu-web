import { createBrowserRouter } from "react-router";
import { RootLayout } from "./RootLayout";
import { HomePage } from "../features/home/HomePage";
import { CategoryPage } from "../features/categories/CategoryPage";
import { ItemPage } from "../features/items/ItemPage";
import { AboutPage } from "../features/about/AboutPage";
import { NotFoundPage } from "./NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "kategori/:slug", element: <CategoryPage /> },
      { path: "oge/:id", element: <ItemPage /> },
      { path: "hakkinda", element: <AboutPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);