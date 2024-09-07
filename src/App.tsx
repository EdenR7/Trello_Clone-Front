import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PlatformLayout from "./layouts/platform-layout";
import AuthLayout from "./layouts/auth-layout";

import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";
import AboutPage from "./pages/about-page";
import TeamPage from "./pages/vision-page";
import VisionPage from "./pages/team-page";

import { useAuth } from "./providers/auth-provider";
import { ReactNode } from "react";
import CardDetailsPage from "./pages/card-details-page";
import BoardLayout from "./components/boardPage/BoardLayout/BoardLayout";
import HomeLayout from "./layouts/HomeLayout";
import BoardPage from "./pages/boards-page";
import HomePage from "./pages/home-page";

interface customRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: customRouteProps) {
  const { loggedInUser } = useAuth();

  if (loggedInUser === undefined) {
    return null;
  }

  if (loggedInUser === null) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}

function AuthRoutes({ children }: customRouteProps) {
  const { loggedInUser } = useAuth();

  if (loggedInUser === undefined) {
    return null;
  }

  if (loggedInUser) {
    return <Navigate to={`/u/${loggedInUser.firstName}/boards`} replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlatformLayout />}>
          <Route index element={<HomePage />} />
          <Route element={<HomeLayout />}>
            <Route
              path="u/:username/boards"
              element={
                <ProtectedRoute>
                  <BoardPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="about" element={<AboutPage />}>
            <Route path="team" element={<TeamPage />} />
            <Route path="vision" element={<VisionPage />} />
          </Route>
          <Route path="contact" element={<div>Contact</div>} />
          <Route path="services" element={<div>Services</div>} />
          <Route
            path="b/:boardId"
            element={
              <ProtectedRoute>
                <BoardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="c/:cardId" element={<CardDetailsPage />} />
          </Route>
        </Route>

        <Route
          path="auth"
          element={
            <AuthRoutes>
              <AuthLayout />
            </AuthRoutes>
          }
        >
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// Fix in the back the function of create label in both card and board
// popovers controll of labels
