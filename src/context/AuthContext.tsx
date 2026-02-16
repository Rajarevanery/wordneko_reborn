import { createContext, useContext, ReactNode } from "react";
import { useGetLoginUser } from "../lib/react-query/queries/queries";

export const AuthContext = createContext<any>(null);

export const useAuth = () => {
  const { data, isError, isLoading } = useGetLoginUser();

  const email = data?.user_metadata?.email;
  const isAuthenticated = data?.aud ? true : false;
  const first_name = data?.user_metadata?.first_name;
  const last_name = data?.user_metadata?.last_name || "";
  const user_id = data?.id;

  return {
    user_id,
    first_name,
    last_name,
    email,
    isAuthenticated,
    isError,
    isLoading,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Error bruh");
  }
  return context;
};
