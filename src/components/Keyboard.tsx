import { useEffect, useState } from "react";
import { FiDelete } from "react-icons/fi";
import { MdSubdirectoryArrowRight } from "react-icons/md";

const Keyboard = ({
  setUserGuess,
  userGuess,
  secretWord,
  passedFunction,
  currentStreak,
  wordArray,
}: any) => {
  const [currentKeyPress, setCurrentKeyPress] = useState<string[]>([]);
  const [keyColors, setKeyColors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setCurrentKeyPress([]);
    setKeyColors({});
  }, [currentStreak]);

  const qwertyKeys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ];

  const handleKeyDown = (event: KeyboardEvent) => {
    const uppedKey = event.key.toUpperCase();
    const convertedToSingleArray = qwertyKeys.flat();

    setCurrentKeyPress((prev: string[]) => {
      if (
        !prev.includes(uppedKey) &&
        convertedToSingleArray.includes(uppedKey)
      ) {
        return [...prev, uppedKey];
      }
      return prev;
    });

    if (uppedKey === "BACKSPACE") {
      setUserGuess((prev: string) => prev.slice(0, -1));
      return;
    }

    if (uppedKey === "ENTER") {
      passedFunction();

      if (wordArray.includes(userGuess.toLowerCase())) {
        updateKeyColors();
      }

      return;
    }

    const isValidKey =
      convertedToSingleArray.includes(uppedKey) && uppedKey.length === 1;
    const isLessThanFive = userGuess.length < 5;

    if (isValidKey && isLessThanFive) {
      setUserGuess((prev: string) => prev + uppedKey);
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const uppedKey = event.key.toUpperCase();
    setCurrentKeyPress((prev: string[]) =>
      prev.filter((key) => key !== uppedKey)
    );
  };

  const updateKeyColors = () => {
    const newKeyColors: { [key: string]: string } = { ...keyColors };

    userGuess.split("").forEach((letter: string, index: number) => {
      if (secretWord.includes(letter)) {
        if (secretWord[index] === letter) {
          newKeyColors[letter] = "bg-green-500";
        } else if (
          !newKeyColors[letter] ||
          newKeyColors[letter] !== "bg-green-500"
        ) {
          newKeyColors[letter] = "bg-yellow-500";
        }
      } else {
        if (!newKeyColors[letter]) {
          newKeyColors[letter] = "bg-gray-500";
        }
      }
    });

    setKeyColors(newKeyColors);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [userGuess]);

  return (
    <div className="text-center flex flex-col gap-2">
      {qwertyKeys.map((item, index) => (
        <div key={index} className="flex items-center justify-center gap-2">
          {item.map((key, keyIndex) => (
            <span
              key={keyIndex}
              className={`min-w-[clamp(3vw,2rem,5rem)] ${
                key.length > 2 ? "w-40 bg-rose-600" : ""
              } flex-row h-[clamp(3vw,2rem,5rem)] text-[clamp(0.8rem,1.5vw,2rem)] flex justify-center items-center duration-75 font-subheader gap-2 cursor-pointer font-semibold px-2 capitalize transition ${
                currentKeyPress.includes(key)
                  ? "opacity-100 bg-slate-700"
                  : keyColors[key] || "opacity-70 bg-slate-800"
              }`}
            >
              {key === "ENTER" && (
                <i className="text-[clamp(0.8rem,4vw,2rem)]">
                  <MdSubdirectoryArrowRight />
                </i>
              )}
              {key === "BACKSPACE" && (
                <i className="text-[clamp(0.8rem,4vw,2rem)]">
                  <FiDelete />
                </i>
              )}
              {key.length < 2 && key}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
