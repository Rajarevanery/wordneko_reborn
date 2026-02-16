import { useNavigate } from "react-router";
import { timeAgo } from "../../lib/utils";
import { ExploreProps } from "../../ts/types";
import { MdOutlineUpdate } from "react-icons/md";

const LatestScoreBoard = ({ scoreData }: ExploreProps) => {
  const navigate = useNavigate();

  const redirectToUser = (user_id: string) => {
    navigate(`/profile/${user_id}`);
  };

  

  return (
    <div className="max-w-7xl mx-auto p-4 bg-slate-900 ">
      <div className="text-center flex items-center justify-center flex-col">
        <h2 className="text-4xl font-header font-bold flex flex-row gap-4 items-center">
          <i className="text-yellow-400 text-5xl">
            <MdOutlineUpdate />
          </i>
          Latest Score
        </h2>
        <p className="text-xl text-white/50 font-paragraph text-center mb-10 flex flex-row items-center justify-center gap-4">
          Note that this is only the 20 latest score
        </p>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-center text-sm rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-800 dark:text-gray-400">
            <tr className="font-header">
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Games
              </th>
              <th scope="col" className="px-6 py-3">
                Scores
              </th>
              <th scope="col" className="px-6 py-3">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="font-subheader">
            {scoreData?.slice(0, 20).map((score) => (
              <tr
                key={score.score_id}
                onClick={() => redirectToUser(score.user_id)}
                className="bg-white border-b cursor-pointer dark:bg-slate-900 hover:bg-slate-950 transition-all dark:border-gray-700"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {score.users.first_name} {score.users.last_name}
                </td>
                <td className="px-6 py-4">
                  {score.games_id === 1
                    ? "Classic Wordle"
                    : score.games_id === 2
                    ? "Timed Wordle"
                    : score.games_id === 3
                    ? "Spelling Bee"
                    : ""}
                </td>
                <td className="px-6 py-4">
                 {score.score} Spelling Points
                </td>
                <td className="px-6 py-4">{timeAgo(score.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LatestScoreBoard;
