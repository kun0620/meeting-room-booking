import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import RoomsPage from "@/features/rooms/pages/RoomsPage";
import MyBookingsPage from "@/features/bookings/pages/MyBookingsPage";
import CalendarPage from "@/features/calendar/pages/CalendarPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import LandingPage from "@/pages/LandingPage";

export const router = createBrowserRouter([
  // ─── Public ───────────────────────────────────────────────────────
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },

  // ─── Protected app shell ──────────────────────────────────────────
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "rooms", element: <RoomsPage /> },
      { path: "bookings", element: <MyBookingsPage /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);