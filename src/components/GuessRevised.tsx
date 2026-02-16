import { motion } from "framer-motion";

type expectedProps = {
  userGuess: string;
  secretWord: string;
  realTime: string;
  isActive: boolean;
};

const GuessRevised = ({
  userGuess,
  secretWord,
  realTime,
  isActive,
}: expectedProps) => {
  const splitUserGuess = userGuess.split("");
  const splitRealTime = realTime.split("");
  const splitSecret = secretWord.split("");

  const colors = Array(secretWord.length).fill("");
  const matchedSecret = Array(secretWord.length).fill(false);

  splitUserGuess.forEach((char, i) => {
    if (char === splitSecret[i]) {
      colors[i] = "green";
      matchedSecret[i] = true;
    }
  });

  splitUserGuess.forEach((char, i) => {
    if (colors[i]) return;

    const foundIndex = splitSecret.findIndex(
      (secretChar, j) => secretChar === char && !matchedSecret[j]
    );

    if (foundIndex !== -1) {
      colors[i] = "yellow";
      matchedSecret[foundIndex] = true;
    }
  });

  return (
    <div className="flex flex-row gap-2 justify-center items-center">
      {new Array(secretWord.length).fill(0).map((_, idx) => {
        const backgroundColor = colors[idx]
          ? colors[idx] === "green"
            ? "#22c55e"
            : "#eab308"
          : "rgba(0, 0, 0, 0)";

        return (
          <motion.div
            key={idx}
            animate={{
              rotateX: userGuess[idx] ? [0, 90, 0] : 0,
              // scale: isActive && splitRealTime[idx] ? [1, 1.1, 1] : 1,
              backgroundColor: [
                "rgba(0, 0, 0, 0)",
                "rgba(0, 0, 0, 0)",
                backgroundColor,
              ],
              borderColor: isActive ? "#c7c4bf" : "rgba(255, 255, 255, 0.4)",
              
            }}
            transition={{
              duration: 0.5,
              delay: idx * 0.2,
              type: "keyframes",
              bounce: 0.25,
            }}
            className={`w-6 h-6 lg:w-10 lg:h-10 2xl:w-14 2xl:h-14 font-subheader font-semibold border ${
              isActive ? "" : "border-white/40"
            } text-center text-3xl flex justify-center items-center`}
          >
            <span className="2xl:text-3xl lg:text-xl text-sm">
              {userGuess.length === 0 && isActive
                ? splitRealTime[idx]
                : splitUserGuess[idx]}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default GuessRevised;
