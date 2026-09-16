import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/features/auth/login-page";
import { useSession } from "@/features/auth/use-session";
import { ItemsPage } from "@/features/items/items-page";
import { env } from "@/lib/env";

export function App() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <p className="p-6 text-sm text-muted-foreground" role="status">
        Bezig met laden…
      </p>
    );
  }

  return (
    <>
      {env.VITE_OMGEVING === "test" && (
        <p className="bg-amber-200 px-3 py-1 text-center text-xs text-amber-950" role="status">
          Testomgeving: dit is de testdatabase, niet de echte app.
        </p>
      )}
      <Routes>
        <Route path="/login" element={session ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route
          path="/"
          element={session ? <ItemsPage session={session} /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
