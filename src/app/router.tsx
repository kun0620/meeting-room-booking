import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import RoomsPage from "@/features/rooms/pages/RoomsPage";
import MyBookingsPage from "@/features/bookings/pages/MyBookingsPage";
import CalendarPage from "@/features/calendar/pages/CalendarPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import LandingPage from "@/pages/LandingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,   // ✅ หน้าแรกจริง
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "rooms", element: <RoomsPage /> },
      { path: "bookings", element: <MyBookingsPage /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);