import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";

const AuthBootstrap = () => {
  const initializeAuth = useAuthStore((s) => s.initializeAuth);

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  return null;
};

export default AuthBootstrap;
