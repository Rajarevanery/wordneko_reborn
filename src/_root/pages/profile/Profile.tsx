import { useNavigate, useParams } from "react-router";
import { useGetUserProfile } from "../../../lib/react-query/mutations/mutations";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useEffect, useState } from "react";
import { timeAgo } from "../../../lib/utils";
import { GoPerson } from "react-icons/go";
import { useAuthContext } from "../../../context/AuthContext";
import { CiSettings } from "react-icons/ci";

const Profile = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const { user_id } = useAuthContext();
  const { mutateAsync: getUserProfile, isPending } = useGetUserProfile();

  type ICurrentRank = {
    global_rank: number;
    total_score: number;
  };

  type ILeaderboardItem = {
    games_id: number;
    score: number;
    score_id: number;
    timestamp: Date;
    user_id: string;
  };

  type ICurrentUser = {
    email: string;
    first_name: string;
    last_name: string;
    id: string;
    global_ranking: ICurrentRank;
    ledaerboard_user_score: ILeaderboardItem[];
  };

  const [currentUserRank, setCurrentUserRank] = useState<ICurrentRank>({
    global_rank: 0,
    total_score: 0,
  });
  const [currentUserScore, setCurrentUserScore] = useState<ILeaderboardItem[]>(
    []
  );
  const [currentUser, setCurrentUser] = useState<ICurrentUser>();

  // ! https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

  // ! this is making a copy instead of directly mutating the currentUserScore
  const copyOfCurrentUserScore = [...currentUserScore];
  const top_score = copyOfCurrentUserScore
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const isSameUser = id === user_id;

  useEffect(() => {
    const getProfile = async () => {
      if (!id) return;

      try {
        const response = await getUserProfile(id);
        setCurrentUserRank(
          response.ranking[0] || {
            global_rank: 0,
            total_score: 0,
          }
        );
        setCurrentUserScore(response.scores);
        setCurrentUser(response.user);
      } catch (error) {
        console.log(error);
      }
    };

    getProfile();
  }, [id]);

  const redirectToSetting = () => {
    navigate(`settings`);
  };

  const handleGetGameName = (games_id: number) => {
    if (games_id === 1) return "Classic";
    if (games_id === 2) return "Speedrun";
    if (games_id === 3) return "Spelling Bee";
  };

  if (isPending || !currentUser) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-950 h-screen">
        <i className="text-6xl text-white animate-spin">
          <AiOutlineLoading3Quarters />
        </i>
      </div>
    );
  }

  return (
    <div className="w-full p-4 text-white font-paragraph">
      <div className="mx-auto max-w-7xl h-[5rem] bg-slate-800 p-6 rounded-lg rounded-b-none flex flex-row items-center gap-6">
        <i className="text-4xl">
          <GoPerson />
        </i>
        <h2 className="font-subheader text-2xl">Player Info</h2>
      </div>
      <div className="bg-slate-900 max-w-7xl mx-auto p-6 rounded-lg rounded-t-none space-y-10">
        <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex flex-row items-center gap-4 font-subheader">
            <div className="w-20 h-20 rounded-full bg-slate-500 flex justify-center items-center">
              <span className="select-none text-4xl">
                {currentUser.first_name.slice(0, 1)}
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl capitalize">
                {currentUser.first_name} {currentUser.last_name}
              </h2>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col bg-slate-800 p-2 px-4 rounded-lg">
                  <span className="text-white/50">Total Score</span>
                  <span>{currentUserRank.total_score || 0}</span>
                </div>
                <div className="flex flex-col bg-slate-800 p-2 px-4 rounded-lg">
                  <span className="text-white/50">Total Games</span>
                  <span>{currentUserScore.length || 0}</span>
                </div>
                <div
                  className={`flex flex-col ${
                    currentUserRank.global_rank <= 5 &&
                    currentUserRank.global_rank >= 1
                      ? "bg-gradient-to-b from-blue-800 to-purple-900"
                      : "bg-slate-800"
                  } p-2 px-4 rounded-lg`}
                >
                  <span className="text-white/50">Global Rank</span>
                  <span>{currentUserRank.global_rank || "Unranked"}</span>
                </div>
              </div>
            </div>
          </div>

          {isSameUser && (
            <button
              onClick={redirectToSetting}
              className="bg-blue-900 flex flex-row items-center gap-2 hover:bg-blue-950 transition text-xl px-4 py-2 rounded-lg font-subheader"
            >
              <i className="text-3xl">
                <CiSettings />
              </i>
              Settings
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-slate-900 rounded-lg p-6 rounded-b-none">
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-subheader font-bold">Top Scores</h2>
          {top_score.length < 1 ? (
            <div>
              <h2>No Scores 😢</h2>
            </div>
          ) : (
            <div className="relative grid grid-cols-1 gap-2">
              {top_score.map(({ games_id, score, timestamp }, index) => (
                <div
                  key={index}
                  className="bg-slate-800 hover:scale-105 transition h-16 items-center flex flex-row rounded-r-lg gap-4 font-subheader"
                >
                  <span className="basis-14 bg-violet-900 h-full grid place-items-center text-xl">
                    {index + 1}
                  </span>
                  <span className="text-xl flex flex-1 font-header flex-col">
                    <p className="text-2xl font-semibold">
                      {handleGetGameName(games_id)}
                    </p>
                    <p className="text-sm text-slate-400">
                      {timeAgo(timestamp)}
                    </p>
                  </span>
                  <span className="font-paragraph text-lg mr-4 font-bold text-rose-400">
                    {score} Spelling Points (SP)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-slate-900 rounded-lg p-6 rounded-t-none">
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-subheader font-bold">Recent Scores</h2>
          {currentUserScore.length < 1 ? (
            <div>
              <h2>No Scores 😢</h2>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-center text-sm rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-800 dark:text-gray-400">
                  <tr className="font-header">
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
                  {currentUserScore.map((score) => (
                    <tr
                      key={score.score_id}
                      className="bg-white border-b dark:bg-slate-900 hover:bg-slate-950 transition-all dark:border-gray-700"
                    >
                      <td className="px-6 py-4">
                        {handleGetGameName(score.games_id)}
                      </td>
                      <td className="px-6 py-4">
                        {score.score} Spelling Points (SP)
                      </td>
                      <td className="px-6 py-4">{timeAgo(score.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
