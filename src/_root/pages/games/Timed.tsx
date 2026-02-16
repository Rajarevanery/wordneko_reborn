import { useEffect, useState } from "react";
import Keyboard from "../../../components/Keyboard";
import { generate } from "random-words";
import GuessRevised from "../../../components/GuessRevised";
import words from "an-array-of-english-words";
import { toast } from "sonner";
import { motion } from "motion/react";
import { clearTimeout, setTimeout } from "worker-timers";
import GameResultModal from "../../../components/shared/GameResultModal";
import Input from "../../../components/shared/Input";
import { useNavigate } from "react-router";
import { usePostScore } from "../../../lib/react-query/mutations/mutations";
import { useAuthContext } from "../../../context/AuthContext";
import { getWordDefinition } from "../../../lib/utils";
import AnimatedSPValue from "../../../components/shared/AnimatedSPValue";
interface WordHistoryItem {
  vocabulary: string;
  time_spent: number;
  exp: number;
  definition: string;
}

const Timed = () => {
  const navigate = useNavigate();

  const [userGuess, setUserGuess] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(""));
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
  const [isDisplayEnd, setisDisplayEnd] = useState<Boolean>(false);
  const [endMessage, setEndMessage] = useState({
    title: "",
    description: "",
    status: "", //lost and won is the status, idk why i did this we couldve just used a boolean
  });
  const [isNotValid, setIsNotValid] = useState<Boolean>(false);
  const [countdown, setCountDown] = useState(3);
  const [isStarted, setIsStarted] = useState(false);
  const [numberTracker, setNumberTracker] = useState<number>(0);
  const [duration, setDuration] = useState({
    minute: 0,
    second: 1,
  });
  const [tempDuration, setTempDuration] = useState({
    minute: 0,
    second: 1,
  });

  const [currentStreak, setCurrentStreak] = useState<number[]>([]);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const [isWon, _] = useState<boolean>(false);
  const [IsDisplayPostStarted, setDisplayPostStarted] =
    useState<Boolean>(false);
  const [isOpenTimer, setIsOpenTimer] = useState<boolean>(false);
  const [wordHistory, setWordHistory] = useState<WordHistoryItem[]>([]);
  const { mutateAsync: postScore } = usePostScore();

  const { user_id } = useAuthContext();

  const summedSPValue = wordHistory.reduce(
    (accumulator, currentValue) => accumulator + currentValue.exp,
    0
  );

  const wordArray = words;

  const [secretWord, setSecretWord] = useState(() =>
    generate({
      exactly: 1,
      minLength: 5,
      maxLength: 5,
      formatter: (word) => word.toUpperCase(),
    })
  );

  const [timePercentage, setTimePercentage] = useState(100);
  // Score=max(1000−(10×time)+(6−currentGuess Index)×100,100)

  // ! this is abomination please refactor this

  useEffect(() => {
    if (countdown > 0 && isStarted) {
      const timer = setTimeout(() => setCountDown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setStartTime(Date.now());
      setDisplayPostStarted(true);
    }
  }, [countdown, isStarted]);

  useEffect(() => {
    if (isStarted && countdown === 0 && !isWon && isRunning) {
      const totalSeconds =
        Number(duration.minute * 60) + Number(duration.second);

      const timer = setInterval(() => {
        setDuration((prev) => {
          const newSecond = prev.second - 1;
          const remainingSeconds = prev.minute * 60 + newSecond;

          if (remainingSeconds < 0) {
            clearInterval(timer);

            if (numberTracker >= 1) {
              handleEnd({ isWon: true, isLost: false });
            } else {
              handleEnd({ isWon: false, isLost: true });
            }
            return { minute: 0, second: 0 };
          }

          setTimePercentage((remainingSeconds / totalSeconds) * 100);

          if (newSecond < 0) {
            return { minute: prev.minute - 1, second: 59 };
          } else {
            return { minute: prev.minute, second: newSecond };
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isStarted, countdown, isWon, isRunning]);

  const handleNext = async () => {
    setIsRunning(false);
    const elapsedTime = startTime
      ? Math.round((Date.now() - startTime) / 1000)
      : 0; // ! YOU CAN TRY TO USE MATH.FLOOR
    const baseScore = 1000; // ! YOU CAN TRY TO USE MATH.FLOOR FOR MORE INFO LOOK IN TODO.MD
    const timePenalty = 25 * elapsedTime;
    const attemptBonus = (6 - currentGuessIndex) * 50;
    const finalScore = Math.max(baseScore - timePenalty + attemptBonus, 100);

    const wordDefinition = await getWordDefinition(secretWord[numberTracker]);

    const currentWord = {
      vocabulary: secretWord[0],
      time_spent: elapsedTime,
      exp: finalScore,
      definition: wordDefinition
        ? wordDefinition
        : "No definition could be found.",
    };

    setWordHistory((prev) => [currentWord, ...prev]);

    setTimeout(() => {
      setCurrentGuessIndex(0);
      setUserGuess("");
      setCurrentStreak((prev) => [...prev, prev.length + 1]);
      setNumberTracker((prev) => prev + 1);
      setGuesses(Array(6).fill(""));
      setCurrentGuessIndex(0);
      const newSecretWord = generate({
        exactly: 1,
        minLength: 5,
        maxLength: 5,
        formatter: (word) => word.toUpperCase(),
      });
      setSecretWord(newSecretWord);
      setDuration({
        minute: tempDuration.minute,
        second: tempDuration.second,
      });
      setIsRunning(true);
      setStartTime(Date.now());
    }, 1500);
  };

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setTempDuration((prev) => ({
      ...prev,
      [name]: value,
    }));

    setDuration((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConditionEnd = () => {
    if (numberTracker >= 1) {
      handleEnd({ isWon: true, isLost: false });
    } else if (numberTracker < 1) {
      handleEnd({ isWon: false, isLost: true });
    }
  };

  const retry = () => {
    setUserGuess("");
    setGuesses(Array(6).fill(""));
    setCurrentGuessIndex(0);
    setisDisplayEnd(false);
    setDisplayPostStarted(false);
    setEndMessage({
      title: "",
      description: "",
      status: "",
    });
    setIsNotValid(false);
    setIsStarted(false);
    setCountDown(3);
    setDuration({
      minute: 0,
      second: 1,
    });
    setIsOpenTimer(false);
    setWordHistory([]);
    setStartTime(Date.now());
    setCurrentStreak([]);
    setNumberTracker(0);

    const newSecretWord = generate({
      exactly: 1,
      minLength: 5,
      maxLength: 5,
      formatter: (word) => word.toUpperCase(),
    });
    setSecretWord(newSecretWord);
  };

  const handleStartGame = () => {
    const checkExceed = duration.second > 60 || duration.minute > 60;
    const checkLess = duration.second < 1 || duration.minute < 0;

    if (checkExceed || checkLess) {
      if (checkExceed) {
        toast.error("You cant exceed second and minute more than 60.");
      } else if (checkLess) {
        toast.error("You cant set second and minute less than 0.");
      }
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
      setIsStarted(true);
      setIsRunning(true);
      setCountDown(3);
    }
  };


  const handleEnd = ({
    isWon,
    isLost,
  }: {
    isWon: Boolean;
    isLost: Boolean;
  }) => {
    setIsRunning(false);

    if (isWon) {
      setEndMessage({
        title: "You Are The Word Master!",
        description: "Your skills are unmatched!",
        status: "won",
      });
      postScore({
        games_id: 2,
        score: summedSPValue,
        user_id: user_id,
      });
    } else if (isLost) {
      setEndMessage({
        title: "Nice try!",
        description: "Better luck next time!",
        status: "lost",
      });
    }

    setisDisplayEnd(true);
  };

  const handleEnterPress = () => {
    if (endMessage.title) {
      return;
    }

    if (!wordArray.includes(userGuess.toLowerCase())) {
      toast.error("Invalid word. Please enter a valid word.");
      // setIsNotValid(true);

      // setTimeout(() => {
      //   setIsNotValid(false);
      // }, 500);

      return;
    }

    if (userGuess.length !== 5) {
      toast.error("Invalid word. Please enter a valid word.");
      // setIsNotValid(true);

      // setTimeout(() => {
      //   setIsNotValid(false);
      // }, 500);

      return;
    }

    setGuesses((prev) =>
      prev.map((guess, index) =>
        index === currentGuessIndex ? userGuess : guess
      )
    );

    const isWon = userGuess === secretWord[0];
    const isLost = currentGuessIndex === 5;

    if (isWon) {
      handleNext();
    } else if (isLost) {
      handleConditionEnd();
    } else {
      setCurrentGuessIndex((prev) => prev + 1);
      setUserGuess("");
    }
  };

  return (
    <section className="text-white p-2 flex m-auto w-full h-full">
      {isDisplayEnd ? (
        <GameResultModal
          endMessage={endMessage}
          secretWord={secretWord}
          onRetry={retry}
          games_id={2}
        />
      ) : (
        ""
      )}
      {countdown !== 0 && isStarted && (
        <div className="w-screen h-screen flex justify-center items-center absolute top-0 left-0">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-7xl text-white font-bold font-header"
          >
            {countdown}
          </motion.h2>
        </div>
      )}

      {IsDisplayPostStarted && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="text-center overflow-visible flex flex-col gap-4 m-auto"
        >
          <div className="flex flex-col gap-4 p-4 max-w-2xl w-full mx-auto">
            <div className="flex flex-col">
              <span
                className={`font-subheader text-xl ${
                  timePercentage < 20 ? "text-red-600" : ""
                }`}
              >
                {duration.minute} :{" "}
                {duration.second.toString().padStart(2, "0")}
              </span>
              <motion.div
                className="w-full h-4 bg-blue-950 rounded-full overflow-hidden relative"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: timePercentage / 100 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className={`h-full ${
                    timePercentage < 20 ? "bg-red-600" : "bg-blue-800"
                  } rounded-full  `}
                  style={{ originX: 0 }}
                />
                <motion.span
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 text-xs text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                ></motion.span>
              </motion.div>
            </div>

            {/* <hr className="opacity-50 my-4" /> */}

            <div className="flex flex-row items-center 2xl:text-[17px] lg:text-[15px] text-[10px] justify-between font-paragraph p-2 w-full bg-slate-900 rounded-lg">
              <div className="flex flex-col text-start">
                <span className="">Current Streak: {currentStreak.length}</span>
                <span className="bg-blue-900 p-1 relative inline-flex justify-center items-center rounded-lg text-center font-semibold overflow-y-hidden h-8">
                  <AnimatedSPValue value={summedSPValue} />
                </span>
              </div>

              <div className="flex flex-col text-end">
                {/* <span>Time Spent: </span> */}
                <button
                  onClick={handleConditionEnd}
                  className="text-white font-subheader cursor-pointer w-40 text-center bg-red-800 rounded p-1 hover:bg-red-900 transition"
                >
                  End Game
                </button>
              </div>
            </div>
          </div>
          {guesses.map((item, index) => (
            <GuessRevised
              key={index}
              userGuess={item}
              realTime={userGuess}
              secretWord={secretWord[0]}
              isActive={currentGuessIndex === index}
            />
          ))}
          <Keyboard
            setUserGuess={setUserGuess}
            userGuess={userGuess}
            secretWord={secretWord[0]}
            wordArray={wordArray}
            isNotValid={isNotValid}
            passedFunction={handleEnterPress}
            currentStreak={currentStreak}
          />
          <div className="bg-slate-900 rounded-lg mt-10 p-4 max-w-4xl w-full">
            <div className="text-start">
              <h1 className="font-subheader font-bold text-xl">
                Words History
              </h1>
              <p className="text-sm opacity-40">
                Note that this is temporary, after this session ends it will
                disappear.
              </p>
            </div>

            <hr className="opacity-40 my-4" />
            <motion.ul className="space-y-4 overflow-scroll max-h-[30rem] transition-all flex flex-col">
              {wordHistory.length < 1 && (
                <h2 className="font-subheader text-xl opacity-50">
                  Your history will appear here.
                </h2>
              )}

              {wordHistory.map(({ vocabulary, exp }, index) => (
                <motion.li
                  key={`${vocabulary}-${index}`}
                  initial={{ opacity: 0 }}
                  layout
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, type: "tween" }}
                >
                  <article className="text-start">
                    <div className="flex flex-row justify-between">
                      <h1 className="text-xl font-bold font-subheader">
                        Vocabulary: {vocabulary}
                      </h1>
                      {/* <p className="text-sm font-paragraph opacity-40">
                            Time Spent: {time_spent}s
                          </p> */}
                    </div>
                    <p className="text-sm font-paragraph opacity-40">
                      Spelling Points: {exp}
                    </p>
                    {/* <div className="space-x-2">
                          <button className="px-2 h-8 mt-2 font-subheader text-sm bg-blue-800 rounded-lg">
                            Save vocabulary
                          </button>
                          <a
                            href={`https://www.oxfordlearnersdictionaries.com/definition/english/${vocabulary}_1?q=${vocabulary}}`}
                            target="_blank"
                          >
                            <button className="px-2 h-8 mt-2 font-subheader text-sm border-blue-800 border rounded-lg">
                              See more information
                            </button>
                          </a>
                        </div> */}
                  </article>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.div>
      )}

      {!isStarted && (
        <div className="max-w-3xl w-full bg-slate-900 backdrop-blur-lg min-h-[20rem] flex flex-col gap-10 p-10 mx-auto rounded-lg">
          <h1 className="text-3xl font-header font-bold">Timed Wordle</h1>

          <button
            onClick={() => setIsOpenTimer(true)}
            className="bg-blue-800 transition relative hover:bg-blue-900 h-[10rem] text-3xl font-subheader font-bold rounded-lg"
          >
            Set Timer
            <p className="text-sm text-white/50 font-light">
              You need to set this up, your current duration is{" "}
              {duration.minute} minute and {duration.second} second
            </p>
          </button>

          <div>
            <h2 className="text-xl font-subheader font-semibold">Objective</h2>
            <p className="text-slate-400 font-paragraph my-2 flex flex-col">
              <span>• Guess the secret 5-letter word and go on streak.</span>

              <span>• Keep guessing correctly to build a streak!</span>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-subheader font-semibold">
              How to play
            </h2>

            <ul className="space-y-2 my-2">
              <li className="text-slate-400 font-paragraph">
                • You have 6 attempts per round.
              </li>
              <li className="text-slate-400 font-paragraph">
                • Only valid English words are accepted.
              </li>
              <li className="text-slate-400 font-paragraph">
                • Set your own time limit before starting.
              </li>
              <li className="text-slate-400 font-paragraph">
                • A 3-second countdown starts the game.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-subheader font-semibold">
              Timer & Retry
            </h2>

            <ul className="space-y-2 my-2">
              <li className="text-slate-400 font-paragraph">
                • The timer bar shows remaining time.
              </li>
              <li className="text-slate-400 font-paragraph">
                • When time is low, the bar turns red.
              </li>
              <li className="text-slate-400 font-paragraph">
                • Your timer resets after guessing the secret word.
              </li>
              <li className="text-slate-400 font-paragraph">
                • After the game ends, you can restart with a new word.
              </li>
            </ul>
          </div>

          <div className="bg-red-900 p-4 rounded-lg space-y-2">
            <h2 className="text-2xl font-subheader font-semibold text-red-400">
              Important Note
            </h2>
            <p className="font-paragraph text-white/50">
              Your score will only be recorded if you complete the game. Closing
              the game early will invalidate your score.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-center">
            <div className="flex flex-row gap-2">
              <button
                onClick={handleStartGame}
                className="bg-blue-800 transition hover:bg-blue-900 flex-1 p-2 rounded-lg"
              >
                Start game
              </button>
              <button
                onClick={() => navigate(-1)}
                className="border transition border-red-900 hover:bg-red-900 flex-1 p-2 rounded-lg"
              >
                Back to explore
              </button>
            </div>
            <p className="mx-auto text-white/50">
              your current duration is {duration.minute} minute and{" "}
              {duration.second} second
            </p>
          </div>
        </div>
      )}

      {isOpenTimer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-slate-900/50 backdrop-blur-lg left-0 top-0 w-screen h-screen fixed z-50 grid place-items-center"
        >
          <div className="w-[50rem] flex flex-col gap-4">
            <Input
              name="minute"
              placeholder="Specify your minute duration"
              text="Minute"
              type="number"
              value={duration.minute}
              onChange={handleInputs}
              min={0}
              max={59}
            />

            <Input
              name="second"
              placeholder="Specify your second duration"
              text="Second"
              type="number"
              value={duration.second}
              onChange={handleInputs}
              min={1}
              max={59}
            />

            <div className="flex flex-row w-full gap-6">
              <button
                onClick={() => setIsOpenTimer(false)}
                className="bg-blue-800 transition hover:bg-blue-900 flex-1 p-2 rounded-lg"
              >
                Set Timer
              </button>
              <button
                onClick={() => setIsOpenTimer(false)}
                className="border transition border-red-900 hover:bg-red-900 flex-1 p-2 rounded-lg"
              >
                Back
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default Timed;
