import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import PlatformLayout from "./layouts/platform-layout";
import AuthLayout from "./layouts/auth-layout";

import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";
import AboutPage from "./pages/about-page";

import { useAuth } from "./providers/auth-provider";
import TeamPage from "./pages/vision-page";
import VisionPage from "./pages/team-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PlatformLayout />,
    children: [
      {
        index: true,
        element: <div>Home</div>,
      },

      {
        path: "about",
        element: <AboutPage />,
        children: [
          {
            path: "team",
            element: <TeamPage />,
          },
          {
            path: "vision",
            element: <VisionPage />,
          },
        ],
      },
      {
        path: "contact",
        element: <div>Contact</div>,
      },
      {
        path: "services",
        element: <div>Services</div>,
      },
      {
        path: "protected",
        element: <ProtectedRoute>Protected</ProtectedRoute>,
      },
    ],
  },
  {
    path: "auth",
    element: (
      <AuthRoutes>
        <AuthLayout />
      </AuthRoutes>
    ),
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
]);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loggedInUser } = useAuth();

  // in case the user is still being fetched
  if (loggedInUser === undefined) {
    return null;
  }

  // if the user is not logged in, redirect
  if (loggedInUser === null) {
    return <Navigate to="/auth/login" replace />;
  }

  // if the user is logged in, show the protected route
  return children;
}

function AuthRoutes({ children }: { children: React.ReactNode }) {
  const { loggedInUser } = useAuth();

  // in case the user is still being fetched
  if (loggedInUser === undefined) {
    return null;
  }

  // if the user is logged in, redirect to home
  if (loggedInUser) {
    return <Navigate to="/" replace />;
  }

  // if the user is not logged in, show the auth routes
  return children;
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
