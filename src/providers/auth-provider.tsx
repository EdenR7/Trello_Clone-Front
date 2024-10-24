import { createContext, useState, useEffect, useContext } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import api from "@/lib/api";
import { RegisterFormValues } from "@/pages/register-page";
import { LoginFormValues as LoginCredentials } from "@/pages/login-page";
import { IBoardBackground } from "@/types/board.types";

export interface IBoardOnUser {
  bg: IBoardBackground;
  name: string;
  _id: string;
}
export interface IWorkspaceOnUser {
  bg: string;
  name: string;
  _id: string;
}
export interface LoggedInUser {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  recentBoards: IBoardOnUser[];
  sttaredBoards: IBoardOnUser[];
  workspaces: IWorkspaceOnUser[];
  isGuest: boolean;
}

interface AuthContextType {
  loggedInUser: LoggedInUser | null | undefined;
  login: (user: LoginCredentials) => Promise<void>;
  register: (user: RegisterCredentials) => Promise<void>;
  logout: () => void;
  setLoggedInUser: React.Dispatch<
    React.SetStateAction<LoggedInUser | null | undefined>
  >;
  updateUserRecentBoards: (board: IBoardOnUser) => void;
  loginAsGuest: () => Promise<string>;
}

type RegisterCredentials = Omit<RegisterFormValues, "confirmPassword">;

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedInUser, setLoggedInUser] = useState<
    LoggedInUser | null | undefined
  >(undefined);
  const [token, setToken] = useLocalStorage("jwt-trello_clone", null);

  useEffect(() => {
    if (!token) {
      setLoggedInUser(null);
      return;
    }

    async function fetchUser() {
      try {
        const response = await api.get("/user");
        setLoggedInUser(response.data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          console.error("Invalid token, logging out");
          logout();
        } else if (error.response?.status === 404) {
          console.error("User not found, logging out");
          logout();
        } else {
          console.error("Error fetching user data:", error);
          logout();
        }
      }
    }

    fetchUser();
  }, [token]);

  function logout() {
    setToken(null);
    setLoggedInUser(null);
  }

  async function login(cred: LoginCredentials) {
    try {
      const response = await api.post("/auth/login", cred);

      setToken(response.data);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  async function loginAsGuest() {
    try {
      const response = await api.post("/auth/guest");
      const { token, username } = response.data;
      setToken(token);
      return username as string;
    } catch (error) {
      console.error("Error logging in as guest:", error);
      throw error;
    }
  }

  async function register(cred: RegisterCredentials) {
    try {
      await api.post("/auth/register", cred);
    } catch (error) {
      console.error("Error registering:", error);
      throw error;
    }
  }

  function updateUserRecentBoards(board: IBoardOnUser) {
    const newRecentBoard: IBoardOnUser = {
      bg: board.bg,
      name: board.name,
      _id: board._id,
    };

    const updatedRecentBoards = [...(loggedInUser?.recentBoards || [])];

    const boardIndex = updatedRecentBoards.findIndex(
      (b) => b._id === board._id
    );

    if (boardIndex !== -1) {
      updatedRecentBoards.splice(boardIndex, 1);
    }
    updatedRecentBoards.unshift(newRecentBoard);

    setLoggedInUser((prevUser) => {
      if (!prevUser) return prevUser; // Handle cases where prevUser might be null or undefined
      return {
        ...prevUser,
        recentBoards: updatedRecentBoards,
      };
    });
  }

  return (
    <AuthContext.Provider
      value={{
        loggedInUser,
        login,
        register,
        logout,
        setLoggedInUser,
        updateUserRecentBoards,
        loginAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
}
