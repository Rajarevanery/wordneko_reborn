import { motion } from "motion/react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router";
import { MdExplore, MdLoop } from "react-icons/md";
import { useEffect, useState, useRef } from "react";
import { useWindowSize } from "react-use";
import { timeAgo } from "../../lib/utils";
import { useGetSpecificGameScore } from "../../lib/react-query/mutations/mutations";
import { useAuthContext } from "../../context/AuthContext";
import { CgProfile } from "react-icons/cg";

type EndMessageType = {
  title: string;
  description: string;
  status: string;
};

type GameResultModalProps = {
  endMessage: EndMessageType;
  secretWord: string | string[];
  onRetry: () => void;
  games_id: number;
};

type ILeaderboard = {
  games_id: number;
  score: number;
  score_id: number;
  timestamp: Date;
  user_id: string;
  users?: { first_name: string };
};

const GameResultModal = ({
  endMessage,
  secretWord,
  onRetry,
  games_id,
}: GameResultModalProps) => {
  const { user_id } = useAuthContext();

  const [leaderboardData, setLeaderboardData] = useState<ILeaderboard[]>([]);
  const { width, height } = useWindowSize();
  const hasFetchedData = useRef(false);
  

  const { mutateAsync: getGameLeaderboard, isPending } =
    useGetSpecificGameScore();

  const navigate = useNavigate();

  useEffect(() => {
    if (!hasFetchedData.current) {
      const getLeaderboard = async () => {
        try {
          const response = await getGameLeaderboard(games_id);
          setLeaderboardData(response);

          hasFetchedData.current = true;
        } catch (error) {
          console.error("Error fetching leaderboard:", error);
        }
      };

      getLeaderboard();
    }
  }, [games_id]);


  const redirectTo = (url: string) => {
    navigate(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.5 }}
      className="overflow-hidden fixed w-screen z-10 h-screen top-0 left-0 bg-slate-900/50 text-center backdrop-blur-md flex justify-center items-center"
    >
      {endMessage.status === "won" && (
        <Confetti width={width} height={height} tweenDuration={5000} />
      )}
      <motion.div
        exit={{ y: 1000 }}
        initial={{ y: -600, opacity: 0 }}
        animate={{ y: 0, opacity: 100 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="bg-slate-800 max-w-2xl flex-col justify-between items-center w-full h-[30rem] p-4 rounded-lg relative flex"
      >
        <motion.div className="overflow-hidden w-full flex flex-col gap-4">
          <h1 className="text-4xl font-header font-bold  text-yellow-300">
            {endMessage.title}
          </h1>
          <p className="font-subheader opacity-80">
            {endMessage.description}{" "}
            <span className="lowercase text-yellow-400">
              (word is {secretWord})
            </span>
          </p>
          <div className="flex flex-col gap-4 w-full">
            <ul className="flex flex-row gap-4 font-subheader *:cursor-pointer mx-auto">
              <li className="px-4 py-1 rounded-full font-subheader text-2xl font-semibold">
                Leaderboard
              </li>
            </ul>

            <div
              className={`w-full rounded-lg bg-slate-700 p-4 h-[17rem] overflow-y-scroll ${
                isPending ? "animate-pulse" : ""
              }`}
            >
              <table className="w-full border-collapse border-spacing-4">
                <thead>
                  <tr className="bg-slate-600 text-center">
                    <th className="p-2">#</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Score (Highest)</th>
                    <th className="p-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData?.map((item, index) => (
                    <tr
                      key={index}
                      className={`border-b border-slate-500 ${
                        user_id === item.user_id ? "bg-white/20" : ""
                      }`}
                    >
                      <td
                        className={`p-2 ${
                          index <= 2 ? "text-yellow-400 w-10" : ""
                        }`}
                      >
                        {index + 1}
                      </td>
                      <td className="p-2">{item?.users?.first_name}</td>
                      <td className="p-2">{item.score} SP</td>
                      <td className="p-2 capitalize">
                        {timeAgo(item.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        <div className="w-full bg-white flex justify-center items-center">
          <div className="absolute -bottom-4 flex flex-row gap-6">
            <button
              className="bg-red-700 rounded-full relative top-5 w-16 h-16 flex justify-center items-center"
              onClick={() => redirectTo("/games")}
            >
              <i className="text-5xl">
                <MdExplore />
              </i>
            </button>
            <motion.button
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "linear",
              }}
              onClick={onRetry}
              className="bg-yellow-500 relative bottom-5 rounded-full w-20 h-20 flex justify-center items-center"
            >
              <i className="text-5xl">
                <MdLoop />
              </i>
            </motion.button>
            <button
              onClick={() => redirectTo(`/profile/${user_id}`)}
              className="bg-red-700 rounded-full relative top-5 w-16 h-16 flex justify-center items-center"
            >
              <i className="text-5xl">
                <CgProfile />
              </i>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameResultModal;
