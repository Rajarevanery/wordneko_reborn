import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../../context/AuthContext";

const AuthLayout = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <section className="flex flex-1 bg-slate-950 flex-row">
      <aside className="relative bg-slate-600/20 backdrop-blur-lg h-screen lg:flex-1 lg:flex hidden">
        <img src="Auth.webp" className="object-center object-cover w-screen h-screen brightness-50" alt="" />
      </aside>
      {isAuthenticated ? <Navigate to={"/games"} /> : <Outlet />}
    </section>
  );
};

export default AuthLayout;
