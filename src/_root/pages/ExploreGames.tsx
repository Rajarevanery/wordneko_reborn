import { BsClock, BsGrid3X3Gap } from "react-icons/bs";
import { CgBee } from "react-icons/cg";
import { useNavigate } from "react-router";

const ExploreGames = () => {
  const navigate = useNavigate();

  const redirectPages = (url: string) => {
    navigate(url);
  };

  const games = [
    {
      name: "Classic Wordle",
      description: "Play Classic Wordle! Guess the hidden word with speed and strategy.",
      icon: <BsGrid3X3Gap />,
      color: "bg-emerald-900",
      link: "/games/wordneko/classic",
    },
    {
      name: "Speedrun Wordle",
      description: "Test your speed in Timed Wordle! Complete the words before the clock runs out.",
      icon: <BsClock />,
      color: "bg-rose-900",
      link: "/games/wordneko/timed",
    },
    {
      name: "Spelling Bee",
      description: "Listen to the word, then type it in! Test your spelling skills.",
      icon: <CgBee />,
      color: "bg-yellow-800",
      link: "/games/wordneko/spelling",
      colSpan: 2,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto rounded-lg bg-slate-900 p-6 rounded-t-none">
      <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 mx-auto">
        {games.map((game) => (
          <li
            key={game.name}
            onClick={() => redirectPages(game.link)}
            className={`w-full ${
              game.colSpan ? "lg:col-span-2" : ""
            } rounded-lg min-h-[40vh] flex items-center justify-center cursor-pointer transition-transform hover:-translate-y-2 duration-700 ${game.color}`}
          >
            <div className="flex flex-col items-center justify-center text-white text-center p-4 gap-2">
              <div className="text-6xl">{game.icon}</div>
              <h3 className="font-subheader text-2xl font-bold">{game.name}</h3>
              <p className="text-sm opacity-75 w-[20rem]">{game.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExploreGames;
