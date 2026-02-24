import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import RoomsPage from "@/features/rooms/pages/RoomsPage";
import MyBookingsPage from "@/features/bookings/pages/MyBookingsPage";
import CalendarPage from "@/features/calendar/pages/CalendarPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <AppLayout />,   // 👈 ต้องมีตัวนี้
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      { path: "rooms", element: <RoomsPage /> },
      { path: "bookings", element: <MyBookingsPage /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);