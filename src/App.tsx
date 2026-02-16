import { Route, Routes } from "react-router";
import Home from "./_root/pages/Home";
import AuthLayout from "./_auth/layout/AuthLayout";
import Signup from "./_auth/pages/Signup";
import { Toaster } from "sonner";
import Signin from "./_auth/pages/Signin";
import RootLayout from "./_root/layout/RootLayout";
import Classic from "./_root/pages/games/Classic";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuthContext } from "./context/AuthContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Settings from "./_root/pages/Settings";
import Explore from "./_root/pages/Explore";
import AnimatedBackground from "./components/shared/AnimatedBackground";
import Timed from "./_root/pages/games/Timed";
import Spelling from "./_root/pages/games/Spelling";
import Saved from "./_root/pages/Saved";
import { useInitiateGetAllScore } from "./lib/react-query/queries/queries";
import Profile from "./_root/pages/profile/Profile";

function App() {
  const { isLoading: pendingUser } = useAuthContext();
  const { data: scoreData, isPending: pendingScore } = useInitiateGetAllScore();

  if (pendingScore || pendingUser) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-950 h-screen">
        <i className="text-6xl text-white animate-spin">
          <AiOutlineLoading3Quarters />
        </i>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen">
      {/* <Toaster richColors theme="dark" /> */}

      <AnimatedBackground />

      <Toaster
        toastOptions={{
          unstyled: true,
          classNames: {
            error:
              "bg-slate-950 flex flex-row gap-2 text-red-500 p-4 items-center rounded-lg border border-white/20 w-full",
            success:
              "bg-slate-950 flex flex-row gap-2 text-green-500 p-4 items-center rounded-lg border border-white/20 w-full",
            warning:
              "bg-slate-950 flex flex-row gap-2 text-red-600 p-4 items-center rounded-lg border border-white/20 w-full",
            info: "bg-slate-950 flex flex-row gap-2 text-white p-4 items-center rounded-lg border border-white/20 w-full",
          },
        }}
      />

      <Routes>
        <Route index path="/" element={<Home />} />

        <Route element={<AuthLayout />}>
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/sign-in" element={<Signin />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<RootLayout />}>
            <Route path="/games">
              <Route index element={<Explore scoreData={scoreData} />} />
              <Route path="wordneko/classic" element={<Classic />} />
              <Route path="wordneko/timed" element={<Timed />} />
              <Route path="wordneko/spelling" element={<Spelling />} />
            </Route>

            <Route path="/profile/:id">
              <Route index element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="/saved" element={<Saved />} />
          </Route>
        </Route>
        <Route
          path="*"
          element={
            <>
              <h1>Not Found bruh</h1>
            </>
          }
        />
      </Routes>
    </main>
  );
}

export default App;
