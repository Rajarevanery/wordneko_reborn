import { motion } from "motion/react";
import { PiSparkleFill } from "react-icons/pi";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  const navigateRegister = () => {
    navigate("/sign-up");
  };

  return (
    <section className="justify-center items-center flex flex-1 bg-slate-950 text-white bg-gradient-to-b from-blue-950 via-transparent to-transparent">
      <div className="max-w-[50rem] text-center z-10">
        <motion.span
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="bg-blue-900 px-4 py-1 gap-2 cursor-default select-none font-subheader rounded-full flex flex-row w-fit mx-auto items-center"
        >
          <i className="text-2xl text-yellow-500">
            <PiSparkleFill />
          </i>{" "}
          Now in beta
        </motion.span>
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-white text-7xl font-header font-bold w-fit m-auto leading-[6rem]"
        >
          <span className="">Unlock Your Potential with </span>
          <span className="bg-blue-800 px-2">Wordneko!</span>
        </motion.h1>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-pretty mx-auto font-subheader mt-6 opacity-70"
        >
          Bored with the same old word games? Wordneko shakes things up. Speed
          challenges, spelling showdowns, and a personal word stash—it's all
          here.
        </motion.p>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <button
            onClick={navigateRegister}
            className="bg-blue-800 hover:bg-blue-700 transition w-[10rem] py-2 rounded-lg font-subheader mt-10"
            aria-label="Start playing speedle"
          >
            Start Exploring!
          </button>
          <p className="font-paragraph opacity-50">
            No payment, just quick, fun challenges.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;
