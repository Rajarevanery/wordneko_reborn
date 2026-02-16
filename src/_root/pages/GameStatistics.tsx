import { BiTrophy } from "react-icons/bi";
import { MdPeopleOutline } from "react-icons/md";
import { ExploreProps } from "../../ts/types";
import { useGetUsersCount } from "../../lib/react-query/queries/queries";
import { RxLetterCaseToggle } from "react-icons/rx";

const GameStatistics = ({ scoreData }: ExploreProps) => {

  const { data: count } = useGetUsersCount();

  const totalScore = scoreData?.reduce(
    (accumulator, currentValue) => accumulator + currentValue.score,
    0
  );
  const totalGamesPlayed = scoreData && scoreData.length + 1;
  const totalUser = count;


  return (
    <div className="max-w-7xl mx-auto p-4 bg-slate-900">
      {/* <h2 className="text-4xl font-header font-bold text-center mb-10">
        Global Statistics
      </h2> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex flex-row items-center gap-4 bg-slate-800 p-4 rounded-lg flex-1 ">
          <div className="bg-blue-800/50 p-1 rounded-lg flex justify-center items-center">
            <i className="text-blue-400 text-5xl">
              <MdPeopleOutline />
            </i>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-header font-bold">
              Total Registered
            </span>
            <span className="text-2xl font-subheader font-bold text-blue-500">
              {totalUser?.toLocaleString('en-US')}
            </span>
            <span className="text-lg font-paragraph text-white/50">
              Players who played
            </span>
          </div>
        </div>
        <div className="flex flex-row items-center gap-4 bg-slate-800 p-4 rounded-lg flex-1">
          <div className="bg-blue-800/50 p-1 rounded-lg flex justify-center items-center">
            <i className="text-blue-400 text-5xl">
              <BiTrophy />
            </i>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-header font-bold">Total Score</span>
            <span className="text-2xl font-subheader font-bold text-blue-500">
              {totalScore?.toLocaleString('en-US')}
            </span>
            <span className="text-lg font-paragraph text-white/50">
              Total Score Across all Games.
            </span>
          </div>
        </div>
        <div className="flex flex-row items-center gap-4 bg-slate-800 p-4 rounded-lg flex-1 ">
          <div className="bg-blue-800/50 p-1 rounded-lg flex justify-center items-center">
            <i className="text-blue-400 text-5xl">
              <RxLetterCaseToggle   />
            </i>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-header font-bold">
              Total Game Played
            </span>
            <span className="text-2xl font-subheader font-bold text-blue-500">
              {totalGamesPlayed?.toLocaleString('en-US')}
            </span>
            <span className="text-lg font-paragraph text-white/50">
              Total games completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStatistics;
