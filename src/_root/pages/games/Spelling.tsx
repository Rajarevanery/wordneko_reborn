import { useState, useEffect, useRef } from "react";
import { BiBookOpen } from "react-icons/bi";
import { BsPlay } from "react-icons/bs";
import GameResultModal from "../../../components/shared/GameResultModal";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { getRandomWordsArray, getWordDefinition } from "../../../lib/utils";
import { AiOutlineEnter } from "react-icons/ai";
import { useNavigate } from "react-router";
import { usePostScore } from "../../../lib/react-query/mutations/mutations";
import { FaHeartCircleMinus } from "react-icons/fa6";
import AnimatedSPValue from "../../../components/shared/AnimatedSPValue";
import WordHistoryCard from "../../../components/shared/WordHistoryCard";
import { useUserCategoryContext } from "../../../context/UserCategoryContext";
import { useAuthContext } from "../../../context/AuthContext";

type IHistory = {
  word: string;
  definition: string;
  time_spent: number;
  exp: number;
};

const Spelling = () => {
  const navigate = useNavigate();
  const synth = window.speechSynthesis;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [secretWord, setSecretWord] = useState<string[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [currentStreak, setCurrentStreak] = useState<number[]>([]);
  const [numberTracker, setNumberTracker] = useState<number>(0);
  const [wordHistory, setWordHistory] = useState<IHistory[]>([]);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const [userInput, setUserInput] = useState<string>("");
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(6);
  const [isDisplayEnd, setIsDisplayEnd] = useState(false);
  const [endMessage, setEndMessage] = useState({
    title: "",
    description: "",
    status: "",
  });
  const [mode, setMode] = useState<string>("classic");
  const summedSPValue = wordHistory.reduce(
    (accumulator, currentValue) => accumulator + currentValue.exp,
    0
  );

  const { user_id } = useAuthContext();

  const { mutateAsync: postScore } = usePostScore();
  const { data: categoryData } = useUserCategoryContext();

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
    };

    synth.onvoiceschanged = loadVoices;
    loadVoices();

    return () => {
      synth.onvoiceschanged = null;
    };
  }, [synth]);

  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);

  function speech() {
    const utterance = new SpeechSynthesisUtterance(secretWord[numberTracker]);
    setIsPlayingAudio(true);
    utterance.lang = "en-US";
    if (voices[selectedVoiceIndex]) {
      utterance.voice = voices[selectedVoiceIndex];
    }
    speechSynthesis.speak(utterance);

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = (event) => {
      console.log(`No speech provided: ${event.error} `);
    };
  }

  const handleChangeVoice = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoiceIndex(Number(e.target.value));
  };

  const handleGetDefinitions = async () => {
    try {
      setIsPlayingAudio(true);
      const definition = await getWordDefinition(secretWord[numberTracker]);

      const utterance = new SpeechSynthesisUtterance(definition);

      utterance.lang = "en-US";
      if (voices[selectedVoiceIndex]) {
        utterance.voice = voices[selectedVoiceIndex];
      }

      speechSynthesis.speak(utterance);

      utterance.onend = () => {
        setIsPlayingAudio(false);
      };
      utterance.onerror = (event) => {
        console.log(`No speech provided: ${event.error} `);
      };
    } catch (error) {
      console.error("Error fetching definition:", error);
    }
  };

  // const handleShortcut = (e: KeyboardEvent) => {
  //   if (e.key === "ctrlKey") {
  //     console.log("Hello There");
  //   }
  // };

  const streakContainerRef = useRef<any>();

  useEffect(() => {
    if (streakContainerRef.current) {
      streakContainerRef.current.scrollLeft =
        streakContainerRef.current.scrollWidth;
    }
  }, [currentStreak]);

  useEffect(() => {
    setStartTime(Date.now());
  }, [isStarted]);

  const next = async () => {
    setUserInput("");
  };
  const checkAnswer = async () => {
    if (userInput.toUpperCase() === secretWord[numberTracker].toUpperCase()) {
      next();
      setCurrentStreak((prev) => [...prev, prev.length + 1]);
      setNumberTracker((prev) => prev + 1);

      const wordDefinition = await getWordDefinition(secretWord[numberTracker]);

      const elapsedTime = startTime
        ? Math.round((Date.now() - startTime) / 1000)
        : 0; // ! YOU CAN TRY TO USE MATH.FLOOR
      const baseScore = 100; // ! YOU CAN TRY TO USE MATH.FLOOR FOR MORE INFO LOOK IN TODO.MD
      const timePenalty = 2 * elapsedTime;
      const attemptBonus = (maxAttempts - attempts) * 10;
      const finalScore = Math.max(baseScore - timePenalty + attemptBonus, 50);

      const wordInformation = {
        word: secretWord[numberTracker],
        definition: wordDefinition,
        exp: finalScore,
        time_spent: elapsedTime,
      };

      setWordHistory((prev) => [wordInformation, ...prev]);
      setStartTime(Date.now());
    } else {
      setAttempts(attempts + 1);

      if (attempts + 1 >= maxAttempts) {
        if (currentStreak.length < 5) {
          setEndMessage({
            title: "Nice try!",
            description: "Better luck next time!",
            status: "lost",
          });
        } else if (currentStreak.length >= 5) {
          setEndMessage({
            title: "You Are The Spelling Master!",
            description: "Your spelling skills are unmatched!",
            status: "won",
          });
          postScore({
            games_id: 3,
            score: summedSPValue,
            user_id: user_id,
          });
        }
        setIsDisplayEnd(true);
      } else {
        toast.error("Incorrect! Try again. Not a valid word!...");
      }
    }
  };

  const retry = async () => {
    setUserInput("");
    setAttempts(0);
    setIsStarted(false);
    const newSecretWord = await getRandomWordsArray(5000);
    setSecretWord(newSecretWord);
    setIsDisplayEnd(false);
    setWordHistory([]);
    setCurrentStreak([]);
    setNumberTracker(0);
    setEndMessage({ title: "", description: "", status: "" });
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      checkAnswer();
    } else {
      return;
    }
  };

  const handleStart = () => {
    setIsStarted(true);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  };

  useEffect(() => {
    // ! the problem here is that it can produce a duplicate because we're going through the txt randomly
    // ! to avoid complications such as making a function to detect duplicate i made an entirely new function
    // ! the function is below
    // const initSecretWord = async () => {
    //   const word = await getRandomWord();
    //   setSecretWord(word);
    // };

    // ! instead of randomly word through the .txt
    // ! we can just generate an array of random word and go each one (avoiding duplicate word per game session)
    const initSecretWordArray = async () => {
      const wordArray = await getRandomWordsArray(5000);
      setSecretWord(wordArray);
    };

    initSecretWordArray();
  }, []);

  const handleMode = (mode: string) => {
    if (mode === "classic") {
      setMode("classic");
      setMaxAttempts(6);
    } else if (mode === "death") {
      setMode("death");
      setMaxAttempts(1);
    }
  };

  const handleSkipCurrentWord = async () => {
    setNumberTracker((prev) => prev + 1);

    if (maxAttempts > 1) {
      setAttempts((prev) => prev + 1);
      const wordDefinition = await getWordDefinition(secretWord[numberTracker]);

      const wordInformation = {
        word: secretWord[numberTracker],
        definition: wordDefinition,
        exp: 0,
        time_spent: 0,
      };

      setWordHistory((prev) => [wordInformation, ...prev]);
    }

    return;
  };

  return (
    <section className="text-white p-2 place-self-center mx-auto w-full h-full overflow-auto">
      <AnimatePresence>
        {isDisplayEnd && (
          <GameResultModal
            endMessage={endMessage}
            secretWord={secretWord[numberTracker]}
            onRetry={retry}
            games_id={3}
          />
        )}
      </AnimatePresence>
      {!isStarted ? (
        <div className="max-w-3xl w-full bg-slate-900 backdrop-blur-lg min-h-[20rem] flex flex-col gap-10 p-10 mx-auto rounded-lg">
          <h1 className="text-3xl font-header font-bold">Spelling Bee</h1>

          <div className="flex flex-row gap-4">
            <button
              onClick={() => handleMode("classic")}
              className={`${
                mode === "classic" ? "bg-blue-800" : "bg-slate-800"
              } flex-col items-center justify-center flex flex-1 border border-white/40 p-4 transition h-[10rem] text-3xl font-subheader font-bold rounded-lg`}
            >
              Classic
              <p className="text-sm text-white/50 font-light">
                You get 6 life, make sure to spell correctly.
              </p>
            </button>
            <button
              onClick={() => handleMode("death")}
              className={`${
                mode === "death" ? "bg-blue-800" : "bg-slate-800"
              } flex flex-1 items-center justify-center flex-col border border-white/40 p-4 transition h-[10rem] text-3xl font-subheader font-bold rounded-lg`}
            >
              Sudden Death!
              <p className="text-sm text-white/50 font-light">
                You only get 1 life!, make sure to spell correctly.
              </p>
            </button>
          </div>

          <div>
            <h2 className="text-xl font-subheader font-semibold">Objective</h2>
            <p className="text-slate-400 font-paragraph my-2">
              • Spell the secret word correctly before running out of attempts.
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
                • Listen to the spoken word and type your answer.
              </li>

              <li className="text-slate-400 font-paragraph">
                • The game continues until you either spell the word correctly
                or use all attempts.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-subheader font-semibold">
              Game End & Retry
            </h2>

            <ul className="space-y-2 my-2">
              <li className="text-slate-400 font-paragraph">
                • If you spell the word correctly, you win and get a streak
                point.
              </li>
              <li className="text-slate-400 font-paragraph">
                • If you run out of attempts, the game ends.
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
      ) : (
        <>
          <div className="max-w-2xl bg-slate-900 mt-[5rem] w-full h-[30rem] gap-10 flex flex-col justify-between p-4 mx-auto rounded-lg">
            <div className="space-y-2">
              <span className="font-subheader flex flex-row justify-between items-center">
                <div className="">
                  Health Bar{" "}
                  <span className="text-red-500">
                    {" "}
                    <span>{maxAttempts - attempts} </span>lives
                  </span>{" "}
                  left
                </div>
                <div>
                  <motion.span
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-blue-900 p-1 min-w-28 relative inline-flex justify-center items-center rounded-lg text-center font-semibold overflow-y-hidden h-8"
                  >
                    <AnimatedSPValue value={summedSPValue} />
                  </motion.span>
                </div>
              </span>
              <motion.div
                initial={{ width: "100%" }}
                animate={{
                  width: `${((maxAttempts - attempts) / maxAttempts) * 100}%`,
                }}
                className="text-center bg-red-500 px-2 py-1 rounded-full"
              ></motion.div>
            </div>

            <AnimatePresence>
              {currentStreak.length < 1 && (
                <h1 className="font-subheader font-bold text-yellow-400 text-center flex flex-col text-2xl bg-blue-900 py-6 rounded-lg">
                  Your streak will display here{" "}
                  <span className="text-sm opacity-40 text-white font-light">
                    Good luck and have fun!
                  </span>
                </h1>
              )}
            </AnimatePresence>
            <motion.div
              ref={streakContainerRef}
              className={`flex relative ${
                numberTracker < 1 && "hidden"
              } flex-row justify-center items-center scrollbar-hidden overflow-auto h-[6rem]`}
            >
              <AnimatePresence>
                {currentStreak.slice().map((item, index) => {
                  return (
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      layout
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 1,
                      }}
                      className="flex flex-row items-center"
                      key={`${item}-${index}`}
                    >
                      <div className="flex flex-col justify-center items-center relative">
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex justify-center items-center">
                          <img src="/flame.gif" className="scale-90" alt="" />
                        </div>

                        <motion.div
                          initial={{ opacity: 0, rotate: 20 }}
                          animate={{ opacity: [0, 1, 1, 1, 0], rotate: 0 }}
                          transition={{
                            duration: 1.2,
                            type: "tween",
                            delay: 1,
                          }}
                          className="absolute h-10 w-20 bottom-6"
                        >
                          <p className="font-subheader font-bold text-yellow-400">
                            +1 Streak!
                          </p>
                        </motion.div>
                        <p className="absolute top-10 font-subheader font-semibold text-yellow-400">
                          {item}
                        </p>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{
                          scale: currentStreak.length === item ? 0 : 1,
                        }}
                        exit={{ scale: 0 }}
                        transition={{
                          delay: 1,
                        }}
                        className="w-6 h-[1px] bg-white/40"
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row border-b items-end border-white/40">
                <div className="flex flex-col flex-1">
                  <label className="opacity-50">Words you hear</label>
                  <input
                    className="bg-transparent outline-none p-1 w-full py-2"
                    onChange={(e) => setUserInput(e.target.value)}
                    value={userInput}
                    onKeyDown={handleEnter}
                  />
                </div>
                <div className="flex flex-row gap-2 mb-2">
                  <button
                    disabled={isPlayingAudio ? true : false}
                    onClick={speech}
                    className=" disabled:text-white/40 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-950 transition-all rounded-sm w-7 h-7 flex justify-center items-center"
                  >
                    <i className="text-xl">
                      <BsPlay />
                    </i>
                  </button>
                  <button
                    onClick={handleGetDefinitions}
                    disabled={isPlayingAudio ? true : false}
                    className="rounded-sm bg-slate-800 hover:bg-slate-700 disabled:bg-slate-950 transition-all disabled:text-white/40 w-7 h-7 flex justify-center items-center"
                  >
                    <i className="text-xl ">
                      <BiBookOpen />
                    </i>
                  </button>
                </div>
              </div>

              <select
                onChange={handleChangeVoice}
                className="appearance-none bg-slate-800 text-white border-white/40 border p-2 rounded-lg"
              >
                {voices.map((item, index) => (
                  <option key={index} value={index}>
                    {item.name} ({item.lang})
                  </option>
                ))}
              </select>
              <div className="flex flex-row gap-6">
                <button
                  className="bg-slate-800 hover:bg-slate-700 disabled:bg-slate-950 transition-all py-2 rounded-lg flex flex-1 justify-center items-center font-header text-2xl font-bold"
                  onClick={checkAnswer}
                  disabled={isPlayingAudio ? true : false}
                >
                  <i className="text-4xl">
                    <AiOutlineEnter />
                  </i>
                </button>
                <button
                  onClick={handleSkipCurrentWord}
                  className="bg-red-900 hover:bg-red-950 gap-2 font-subheader disabled:bg-slate-950 transition-all py-2 rounded-lg flex flex-1 justify-center items-center text-lg font-bold"
                  disabled={
                    isPlayingAudio
                      ? true
                      : false || attempts === 5 || maxAttempts === 1
                      ? true
                      : false
                  }
                >
                  <i className="text-4xl text-red-600">
                    <FaHeartCircleMinus />
                  </i>
                  Skip current word (-1 live)
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-2xl bg-slate-900 rounded-lg mx-auto mt-10 p-4">
            <div>
              <h1 className="font-subheader font-bold text-xl">
                Words History
              </h1>
              <p className="text-sm opacity-40">
                Note that this is temporary, after a refresh it will disappear,
                but you can export this.
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
                {wordHistory.map(({ word, definition }, index) => (
                  <WordHistoryCard
                    word={word}
                    definition={definition}
                    categoryData={categoryData}
                    key={index}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>
        </>
      )}
    </section>
  );
};

export default Spelling;
