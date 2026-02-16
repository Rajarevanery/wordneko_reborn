import { AnimatePresence, motion } from "motion/react";
import ExploreGames from "./ExploreGames";
import GameStatistics from "./GameStatistics";
import { ExploreProps } from "../../ts/types";
import LatestScoreBoard from "./LatestScoreBoard";
import GlobalRanking from "./GlobalRanking";
import { MdExplore } from "react-icons/md";
import { RiGlobalFill } from "react-icons/ri";

const Explore = ({ scoreData }: ExploreProps) => {
  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full p-4 text-white font-paragraph"
      >
        <div className="mx-auto max-w-7xl h-[5rem] bg-slate-800 p-6 rounded-lg rounded-b-none flex flex-row items-center gap-6">
          <i className="text-4xl">
            <MdExplore />
          </i>
          <h2 className="font-subheader text-2xl">Explore Games</h2>
        </div>
        <ExploreGames />
        <div className="mx-auto max-w-7xl h-[5rem] bg-slate-800 mt-10 p-6 rounded-lg rounded-b-none flex flex-row items-center gap-6">
          <i className="text-4xl">
            <RiGlobalFill />
          </i>
          <h2 className="font-subheader text-2xl">Global Statistics</h2>
        </div>
        <GameStatistics scoreData={scoreData} />
        <GlobalRanking />
        <LatestScoreBoard scoreData={scoreData} />
      </motion.section>
    </AnimatePresence>
  );
};

export default Explore;
