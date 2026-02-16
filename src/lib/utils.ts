// import * as XLSX from "xlsx";

import { useEffect, useRef } from "react";

// import words from "an-array-of-english-words";

// export async function getRandomWord(): Promise<string> {
//   try {
//     const response = await fetch("/constant/words.txt");
//     if (!response.ok) throw new Error(`Failed: ${response.statusText}`);

//     const text = await response.text();
//     const wordsArray = text
//       .split("\n")
//       .map((word) => word.trim())
//       .filter((word) => word);

//     if (wordsArray.length === 0) throw new Error("Error, word list none man");

//     return wordsArray[Math.floor(Math.random() * wordsArray.length)];
//   } catch (error) {
//     console.error("Error:", error);
//     return "ERROR";
//   }
// }

export async function getRandomWord(): Promise<string> {
  try {
    const response = await fetch("/constant/wordDictionary.txt");
    if (!response.ok) throw new Error(`Failed: ${response.statusText}`);

    const text = await response.text();
    const wordsArray = text
      .split("\n")
      .map((line) => line.split("|")[0].trim())
      .filter((word) => word);

    if (wordsArray.length === 0) throw new Error("Error, word list none man");

    return wordsArray[Math.floor(Math.random() * wordsArray.length)];
  } catch (error) {
    console.error("Error:", error);
    return "ERROR";
  }
}

export async function getRandomWordsArray(count: number): Promise<string[]> {
  try {
    const response = await fetch("/constant/wordDictionary.txt");
    if (!response.ok) throw new Error(`Failed: ${response.statusText}`);

    const text = await response.text();
    const wordsArray = text
      .split("\n")
      .map((line) => line.split("|")[0].trim())
      .filter((word) => word);

    if (wordsArray.length === 0) throw new Error("Error, word list none man");

    const shuffled = wordsArray.sort(() => Math.random() - 0.5);

    return shuffled.slice(0, count);
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function getWordDefinition(word: string): Promise<string> {
  try {
    const response = await fetch("/constant/wordDictionary.txt");
    if (!response.ok) throw new Error(`Failed: ${response.statusText}`);

    const text = await response.text();
    const wordEntry = text
      .split("\n")
      .map((line) => line.trim())
      .find(
        (line) => line.split("|")[0].trim().toLowerCase() === word.toLowerCase()
      );

    if (!wordEntry) throw new Error(`Definition for "${word}" not found`);

    const [_, __, definition] = wordEntry.split("|");
    return definition.trim();
  } catch (error) {
    console.error("Error:", error);
    return "Definition not found";
  }
}

export const useScrollDirection = (callback: any) => {
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY.current) {
            callback("down");
          } else if (currentScrollY < lastScrollY.current) {
            callback("up");
          }
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [callback]);
};

// ! IDK HOW THIS CODE WORKS (GPT'ED), THIS IS AN ATTEMPT OF ME TRYING TO BE LAZY ASS
// ! Please future me, or future programmer try to fix this or optimize this IF its bad code / doesnt cover all edge cases
export function timeAgo(timestamp: any) {
  const date = new Date(timestamp.replace(" ", "T") + "Z");
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsPerUnit] of Object.entries(intervals)) {
    const value = Math.floor(seconds / secondsPerUnit);
    if (value >= 1) {
      return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

export const formatTime = (seconds: number) => {
  const getSeconds = `0${seconds % 60}`.slice(-2);
  const minutes = Math.floor(seconds / 60);
  const getMinutes = `0${minutes % 60}`.slice(-2);
  const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
  return `${getHours}:${getMinutes}:${getSeconds}`;
};

// export async function getRandomWordWordsTXTVER(): Promise<string> {
//   try {
//     if (!words || words.length === 0) throw new Error("Word list is empty");
//     return words[Math.floor(Math.random() * words.length)].toUpperCase();
//   } catch (error) {
//     console.error("Error:", error);
//     return "ERROR";
//   }
// }

// export const getRandomWordSpeedle = async (): Promise<string> => {
//   try {
//     const response = await fetch("/constant/words.xls");
//     const arrayBuffer = await response.arrayBuffer();
//     const workbook = XLSX.read(arrayBuffer, { type: "array" });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const words = XLSX.utils.sheet_to_json<{ word: string }>(sheet, { header: 1 })
//       .flat()
//       .map((word: any) => word.toString().trim())
//       .filter(Boolean);

//     if (words.length === 0) throw new Error("No words found in file");

//     const randomIndex = Math.floor(Math.random() * words.length);
//     return words[randomIndex].toUpperCase();
//   } catch (error) {
//     console.error("Error loading words:", error);
//     return "ERROR";
//   }
// };
