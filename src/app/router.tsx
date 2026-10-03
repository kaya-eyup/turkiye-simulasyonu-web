import { createBrowserRouter } from "react-router";
import { RootLayout } from "./RootLayout";
import { HomePage } from "../features/home/HomePage";
import { CategoryPage } from "../features/categories/CategoryPage";
import { ItemPage } from "../features/items/ItemPage";
import { AboutPage } from "../features/about/AboutPage";
import { NotFoundPage } from "../shared/ui/NotFoundPage";
import { SearchPage } from "../features/search/SearchPage";
import { RouteErrorPage } from "../shared/ui/RouteErrorPage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,

    children: [
      {
        errorElement: <RouteErrorPage />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "kategori/:slug", element: <CategoryPage /> },
          { path: "oge/:id", element: <ItemPage /> },
          { path: "hakkinda", element: <AboutPage /> },
          { path: "ara", element: <SearchPage /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
