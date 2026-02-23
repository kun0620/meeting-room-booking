import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "./layout/DashboardLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RoomListPage } from "@/features/rooms/pages/RoomListPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <RoomListPage /> },
    ],
  },
]);