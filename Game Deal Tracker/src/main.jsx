import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import "./index.css";
import Layout from "./routes/layout";
import Home from "./routes/home";
import GamePage from "./routes/gamepage";
import GameListingsPage from "./routes/gamelistingspage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "game/:gameID",
        element: <GamePage />
      },
      {
        path: "games/:title",
        element: <GameListingsPage />
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);