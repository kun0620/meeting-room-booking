import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { AppProvider } from "./layouts/providers";

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
