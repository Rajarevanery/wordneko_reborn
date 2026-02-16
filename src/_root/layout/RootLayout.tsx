import { Outlet } from "react-router";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { UserCategoryProvider } from "../../context/UserCategoryContext";

const RootLayout = () => {
  return (
    <section className="flex flex-1 bg-slate-950 min-h-screen flex-col bg-gradient-to-b from-blue-950 via-transparent to-transparent ">
      <Navbar />

      <div className="pt-[4rem] z-10 min-h-screen">
        <UserCategoryProvider>
          <Outlet />
        </UserCategoryProvider>
      </div>

      <Footer />
    </section>
  );
};

export default RootLayout;
