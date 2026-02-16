import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryProvider } from "./lib/react-query/QueryProvider.tsx";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import "./index.css";
import "./styles/sonner.css";
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>
);
