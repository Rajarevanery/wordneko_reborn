import { useState } from "react";
import speedleIcon from "../assets/speedle_icon.png";
import { useAuthContext } from "../context/AuthContext";
import { BsGrid3X3GapFill, BsPerson } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { useLogoutUser } from "../lib/react-query/mutations/mutations";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { MdExplore, MdOutlineExplore } from "react-icons/md";
import { LuBookMarked } from "react-icons/lu";
import { useScrollDirection } from "../lib/utils";

const Navbar = () => {
  const { email, first_name, last_name, user_id } = useAuthContext();
  const { mutateAsync: logoutUser } = useLogoutUser();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentScrollDirection, setCurrentScrollDirection] =
    useState<string>("");

  const openUserDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutUser = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log(error);
    }
  };

  useScrollDirection((direction: string) => {
    setCurrentScrollDirection(direction);
  });

  return (
    <header
      className={`top-0 left-0 w-screen transition-all duration-500 z-20 h-full max-h-[4rem] fixed p-4 ${
        currentScrollDirection === "down" ? "" : "bg-slate-900"
      }`}
    >
      <nav
        className={`flex flex-row transition-all duration-500 justify-between items-center text-white h-full ${
          currentScrollDirection === "down"
            ? "max-w-4xl bg-slate-800/50 p-6"
            : "max-w-7xl"
        } mx-auto rounded-lg`}
      >
        <div className="flex flex-row items-center gap-2 cursor-pointer group transition-all">
          <img src={speedleIcon} className="w-16" alt="speedle icon" />
          <h1 className="font-subheader font-semibold text-lg group-hover:text-blue-400 transition">
            WordNeko
          </h1>
        </div>

        <div className="flex flex-row items-center">
          <div className="font-paragraph text-lg">
            <ul className="flex flex-row gap-4">
              {/* <Link to={"/"}>
                <li className="flex flex-row gap-2 items-center px-2 rounded-lg text-2xl">
                  <BiHomeAlt />
                </li>
              </Link> */}
              <Link to={"/games"}>
                <li className="flex flex-row gap-2 items-center px-2 rounded-lg text-2xl hover:bg-blue-500/40 transition p-2">
                  <MdOutlineExplore />
                </li>
              </Link>

              <li
                className="flex flex-row gap-2 items-center px-2 rounded-lg cursor-pointer text-2xl hover:bg-blue-500/40 transition p-2"
                onClick={openUserDropdown}
              >
                <BsGrid3X3GapFill />
              </li>
            </ul>
          </div>

          <div className="flex flex-row relative items-center">
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, type: "spring" }}
                  exit={{ opacity: 0 }}
                  className="bg-slate-950 rounded-lg border border-white/40 absolute w-[30rem] lg:w-[38rem] min-h-[15rem] top-10 right-0"
                >
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-row gap-2 items-center p-2">
                      <div className="w-10 h-10 rounded-full bg-slate-500 flex justify-center items-center">
                        <span className="select-none">
                          {first_name.slice(0, 1)}
                        </span>
                      </div>

                      <div className="flex flex-col font-subheader">
                        <span>
                          {first_name} {last_name}
                        </span>
                        <span className="opacity-50 text-sm">{email}</span>
                      </div>
                    </div>
                    <hr className="opacity-50 mt-2" />

                    <div className="">
                      <ul className="grid grid-rows-3 grid-flow-col p-2 gap-2 font-subheader">
                        <Link to={`/profile/${user_id}`}>
                          <li className="flex flex-col gap-2 hover:bg-slate-800 p-1 rounded-lg transition cursor-pointer">
                            <div className="flex flex-row gap-4 items-start">
                              <i className="text-2xl bg-slate-800 p-2 rounded-lg border border-white/40">
                                <BsPerson />
                              </i>
                              <p className="flex flex-col">
                                <span>Profile</span>
                                <span className="opacity-70 text-sm">
                                  Check your profile out
                                </span>
                              </p>
                            </div>
                          </li>
                        </Link>

                        {/* <li className="flex flex-col gap-2 hover:bg-slate-800 p-1 rounded-lg transition cursor-pointer">
                          <div className="flex flex-row gap-4 items-start">
                            <i className="text-2xl bg-slate-800 p-2 rounded-lg border border-white/40">
                              <BsGraphUp />
                            </i>
                            <p className="flex flex-col">
                              <span>Statistics</span>
                              <span className="opacity-70 text-sm">
                                Your game stats.
                              </span>
                            </p>
                          </div>
                        </li> */}

                        {/* <li className="flex flex-col gap-2 hover:bg-slate-800 p-1 rounded-lg transition cursor-pointer">
                          <Link to={"/settings"}>
                            <div className="flex flex-row gap-4 items-start">
                              <i className="text-2xl bg-red-800 p-2 rounded-lg border border-white/40">
                                <FaExclamation />
                              </i>
                              <p className="flex flex-col">
                                <span>Change Credential</span>
                                <span className="opacity-70 text-sm">
                                  Update your credentials.
                                </span>
                              </p>
                            </div>
                          </Link>
                        </li> */}

                        <li className="flex flex-col gap-2 hover:bg-slate-800 p-1 rounded-lg transition cursor-pointer">
                          <Link to={"/games"}>
                            <div className="flex flex-row gap-4 items-start">
                              <i className="text-2xl bg-slate-800 p-2 rounded-lg border border-white/40">
                                <MdExplore />
                              </i>
                              <p className="flex flex-col">
                                <span>Explore</span>
                                <span className="opacity-70 text-sm">
                                  Discover new games and challenges.
                                </span>
                              </p>
                            </div>
                          </Link>
                        </li>

                        <li className="flex flex-col gap-2 hover:bg-slate-800 p-1 rounded-lg transition cursor-pointer">
                          <Link to={"/saved"}>
                            <div className="flex flex-row gap-4 items-start">
                              <i className="text-2xl bg-slate-800 p-2 rounded-lg border border-white/40">
                                <LuBookMarked />
                              </i>
                              <div className="flex flex-col">
                                <div className="space-x-2 relative">
                                  <span>Saved Words</span>
                                  <span className="font-subheader opacity-80 font-semibold  text-red-600">
                                    EXPERIMENTAL
                                  </span>
                                </div>
                                <span className="opacity-70 text-sm">
                                  Saved word from a game session.
                                </span>
                              </div>
                            </div>
                          </Link>
                        </li>
                      </ul>
                      <hr className="opacity-50 mt-2" />
                      <div className="flex flex-row gap-2 items-center p-2 cursor-pointer">
                        <i className="text-2xl">
                          <BiLogOut />
                        </i>
                        <button
                          className="font-subheader"
                          onClick={handleLogoutUser}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
