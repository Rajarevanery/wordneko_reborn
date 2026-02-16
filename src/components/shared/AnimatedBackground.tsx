import React, { useEffect, useState } from "react";
import "../../styles/AnimatedBackground.css";
import { setInterval, clearInterval } from "worker-timers";

const MAX_SQUARES = 20;
// const MIN_SQUARES = 10;

const AnimatedBackground: React.FC = () => {
  const [squares, setSquares] = useState<
    {
      id: number;
      size: number;
      duration: number;
      delay: number;
      left: number;
    }[]
  >([]);

  useEffect(() => {
    const generateSquare = () => ({
      id: Math.random(),
      size: 1 + Math.random() * 2,
      duration: 15 + Math.random() * 5,
      delay: Math.random() * 5,
      left: Math.random() * 100,
    });

    const interval = setInterval(() => {
      setSquares((prevSquares) => {
        if (prevSquares.length >= MAX_SQUARES) return prevSquares;
        const newSquares = [...prevSquares, generateSquare()];
        return newSquares.slice(-MAX_SQUARES);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="background">
      {squares.map(({ id, size, duration, delay, left }) => (
        <div
          key={id}
          className="square"
          style={{
            width: `${size}em`,
            height: `${size}em`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            left: `${left}vw`,
          }}
          onAnimationEnd={() => {
            setSquares((prevSquares) =>
              prevSquares.filter((sq) => sq.id !== id)
            );
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
