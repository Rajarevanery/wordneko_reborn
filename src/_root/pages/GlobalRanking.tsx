import { useEffect, useState } from "react";
import { useGetGlobalRanking } from "../../lib/react-query/mutations/mutations";
import { BiTrophy } from "react-icons/bi";
import { useNavigate } from "react-router";

type expectedRanksData = {
  global_rank: number;
  total_score: number;
  user_id: string;
  first_name: string;
  last_name: string;
};


const GlobalRanking = () => {
  const { mutateAsync: getGlobalRanking } = useGetGlobalRanking();
  const navigate = useNavigate();

  const [ranksData, setRanksData] = useState<expectedRanksData[]>([]);

  useEffect(() => {
    const getGlobal = async () => {
      try {
        const response = await getGlobalRanking();
        setRanksData(response);
      } catch (error) {
        console.log(error);
      }
    };

    getGlobal();
  }, []);

  const redirectToUser = (user_id: string) => {
    navigate(`/profile/${user_id}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-slate-900">
      <h2 className="text-4xl font-header font-bold text-center flex flex-row items-center justify-center gap-4">
        <i className="text-yellow-400">
          <BiTrophy />
        </i>
        Global Ranking
      </h2>
      <p className="text-xl text-white/50 font-paragraph text-center mb-10 flex flex-row items-center justify-center gap-4">
        Note that this is all across gamemode combined
      </p>

      <div className="relative overflow-x-auto">
        {/* <ol className="space-y-4">
          {ranksData?.map((user, index) => (
            <li
              key={index}
              className="flex flex-row gap-5 justify-between  font-subheader text-lg p-2"
            >
              <div className="flex flex-row gap-4">
                <span>
                  # {user.global_rank}
                </span>
                <span>
                  {user.users.first_name} {user.users.last_name}
                </span>
              </div>
              <span>{user.total_score} Total score</span>
            </li>
          ))}
        </ol> */}
        <table className="w-full text-center text-sm rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-800 dark:text-gray-400">
            <tr className="font-header">
              <th scope="col" className="px-6 py-3">
                Ranks
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Total Scores (*)
              </th>
            </tr>
          </thead>
          <tbody className="font-subheader">
            {ranksData?.map((user, index) => (
              <tr
                key={index}
                onClick={() => redirectToUser(user.user_id)}
                className="bg-white border-b cursor-pointer dark:bg-slate-900 hover:bg-slate-950 transition-all dark:border-gray-700"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  #{user.global_rank}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {user?.first_name} {user?.last_name}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {user.total_score?.toLocaleString('en-US')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <div className="max-w-7xl mx-auto mt-4 flex flex-col justify-center items-center">
          <button className="font-subheader text-2xl bg-blue-950 hover:bg-blue-900 transition p-2 rounded-lg">
            See here for per gamemode ranking!
          </button>
          <p className="text-white/40 font-subheader text-sm">
            (Classic, Timed / Speedrun, Spelling)
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default GlobalRanking;
