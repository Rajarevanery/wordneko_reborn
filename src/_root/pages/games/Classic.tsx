import { useEffect, useState } from "react";
import Keyboard from "../../../components/Keyboard";
import { generate } from "random-words";
import GuessRevised from "../../../components/GuessRevised";
import words from "an-array-of-english-words";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import {
  clearInterval,
  clearTimeout,
  setInterval,
  setTimeout,
} from "worker-timers";
import GameResultModal from "../../../components/shared/GameResultModal";
import { useNavigate } from "react-router";
import { usePostScore } from "../../../lib/react-query/mutations/mutations";
import { useAuthContext } from "../../../context/AuthContext";
import { formatTime, getWordDefinition } from "../../../lib/utils";
import AnimatedSPValue from "../../../components/shared/AnimatedSPValue";

type IHistory = {
  vocabulary: string;
  time_spent: number;
  exp: number;
  definition: string;
};

const Classic = () => {
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
  const [isPostStarted, setIsPostStarted] = useState(false);
  const [currentStreak, setCurrentStreak] = useState<number[]>([]);
  const [numberTracker, setNumberTracker] = useState<number>(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [wordHistory, setWordHistory] = useState<IHistory[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const { mutateAsync: postScore } = usePostScore();

  const { user_id } = useAuthContext();
  const summedSPValue = wordHistory.reduce(
    (accumulator, currentValue) => accumulator + currentValue.exp,
    0
  );

  // ! if a problem occured just use the .txt from here https://github.com/sindresorhus/word-list/tree/main

  const wordArray = words;

  const [secretWord, setSecretWord] = useState(() =>
    generate({
      exactly: 1,
      minLength: 5,
      maxLength: 5,
      formatter: (word) => word.toUpperCase(),
    })
  );

  // const streakContainerRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (streakContainerRef.current) {
  //     streakContainerRef.current.scrollLeft =
  //       streakContainerRef.current.scrollWidth;
  //   }
  // }, [currentStreak]);

  useEffect(() => {
    if (countdown > 0 && isStarted) {
      const timer = setTimeout(() => setCountDown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setIsPostStarted(true);
      setStartTime(Date.now());
      handleStartStop();
    }
  }, [countdown, isStarted]);

  useEffect(() => {
    let timer: number;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleConditionEnd = () => {
    if (numberTracker >= 1) {
      handleEnd({ isWon: true, isLost: false });
    } else if (numberTracker < 1) {
      handleEnd({ isWon: false, isLost: true });
    }
  };


  // const handleReset = () => {
  //   setTime(0);
  //   setIsRunning(false);
  // };

  const handleNext = async () => {
    const elapsedTime = startTime
      ? Math.round((Date.now() - startTime) / 1000)
      : 0; // ! YOU CAN TRY TO USE MATH.FLOOR
    const baseScore = 1000; // ! YOU CAN TRY TO USE MATH.FLOOR FOR MORE INFO LOOK IN TODO.MD
    const timePenalty = 25 * elapsedTime;
    const attemptBonus = (6 - currentGuessIndex) * 50;
    const finalScore = Math.max(baseScore - timePenalty + attemptBonus, 50);

    // Score=max(1000−(10×time)+(6−currentGues sIndex)×100,100)
    setIsRunning(false);

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
      setTime(0);
      setIsRunning(true);
      setStartTime(Date.now());
    }, 1500);
  };

  const retry = () => {
    setUserGuess("");
    setGuesses(Array(6).fill(""));
    setIsPostStarted(false);
    setCurrentGuessIndex(0);
    setisDisplayEnd(false);
    setEndMessage({
      title: "",
      description: "",
      status: "",
    });
    setIsNotValid(false);
    setIsStarted(false);
    setCountDown(3);
    setWordHistory([]);
    setCurrentStreak([]);
    setNumberTracker(0);

    const newSecretWord = generate({
      exactly: 1,
      minLength: 5,
      maxLength: 5,
      formatter: (word) => word.toUpperCase(),
    });
    setSecretWord(newSecretWord);
    setTime(0);
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
        games_id: 1,
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
    if (!wordArray.includes(userGuess.toLowerCase())) {
      toast.error("Invalid word. Please enter a valid word.");
      return;
    }

    if (userGuess.length !== 5) {
      toast.error("Invalid word. Please enter a valid word.");
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

  const handleStart = () => {
    setCountDown(3);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
    setIsStarted(true);
  };

  return (
    <section className="text-white p-2 flex w-full h-full">
      <AnimatePresence>
        {isDisplayEnd ? (
          <GameResultModal
            endMessage={endMessage}
            secretWord={secretWord}
            onRetry={retry}
            games_id={1}
          />
        ) : (
          ""
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isStarted && (
          <div className="w-full bg-slate-900 backdrop-blur-lg max-w-3xl mx-auto min-h-[20rem] flex flex-col gap-10 p-10 rounded-lg">
            <h1 className="text-3xl font-header font-bold">Classic Wordle</h1>

            <div>
              <h2 className="text-xl font-subheader font-semibold">
                Objective
              </h2>
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
                  • You get 6 chances to guess the word each round.
                </li>
                <li className="text-slate-400 font-paragraph">
                  • Only real English words will count.
                </li>
                <li className="text-slate-400 font-paragraph">
                  • As long as you keep guessing the word correctly, you’ll move
                  on to the next round.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-subheader font-semibold">
                Game End & Retry
              </h2>

              <ul className="space-y-2 my-2">
                <li className="text-slate-400 font-paragraph">
                  • If you guess the word correctly, your streak continues, and
                  you’ll get a new word.
                </li>
                <li className="text-slate-400 font-paragraph">
                  • If you use up all your attempts without guessing the word,
                  your streak ends and the game is over.
                </li>
                <li className="text-slate-400 font-paragraph">
                  • After the game ends, you can start over with a fresh word.
                </li>
              </ul>
            </div>

            <div className="bg-red-900 p-4 rounded-lg space-y-2">
              <h2 className="text-2xl font-subheader font-semibold text-red-400">
                Important Note
              </h2>
              <p className="font-paragraph text-white/50">
                Your score will only be recorded if you complete the game.
                Closing the game early will invalidate your score.
              </p>
            </div>

            <div className="flex flex-col gap-2 text-center">
              <div className="flex flex-row gap-2">
                <button
                  onClick={handleStart}
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
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPostStarted && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center overflow-visible flex flex-col gap-4 justify-center items-center mx-auto"
          >
            <div className="flex flex-row items-center 2xl:text-[17px] lg:text-[15px] text-[10px] justify-between font-paragraph p-2 w-full bg-slate-900 rounded-lg">
              <div className="flex flex-col text-start">
                <span className="">Current Streak: {currentStreak.length}</span>
                <span className="bg-blue-900 p-1 relative inline-flex justify-center items-center rounded-lg text-center font-semibold overflow-y-hidden h-8">
                  <AnimatedSPValue value={summedSPValue} />
                </span>
              </div>

              <div className="flex flex-col text-end">
                <span>Time Spent: {formatTime(time)}</span>
                <button
                  onClick={handleConditionEnd}
                  className="text-white font-subheader cursor-pointer text-center bg-red-800 rounded p-1 hover:bg-red-900 transition"
                >
                  End Game
                </button>
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
                <AnimatePresence>
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
                </AnimatePresence>
              </motion.ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isStarted && countdown !== 0 && (
        <div className="w-screen h-screen flex justify-center items-center absolute top-0 left-0">
          {countdown && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-7xl text-white font-bold font-header"
            >
              {countdown}
            </motion.h2>
          )}
        </div>
      )}
    </section>
  );
};

export default Classic;
