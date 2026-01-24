import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Menu from "../pages/menu/page";
import EventsNews from "../pages/events-news/page";
import About from "../pages/about/page";
import Gallery from "../pages/gallery/page";
import Reservations from "../pages/reservations/page";
import Contact from "../pages/contact/page";
import Login from "../pages/login/page";
import Manage from "../pages/manage/page";
import Impressum from "../pages/impressum/page";
import Privacy from "../pages/privacy/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/menu",
    element: <Menu />,
  },
  {
    path: "/events-news",
    element: <EventsNews />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/gallery",
    element: <Gallery />,
  },
  {
    path: "/reservations",
    element: <Reservations />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/manage",
    element: <Manage />,
  },
  {
    path: "/impressum",
    element: <Impressum />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
