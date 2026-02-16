import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const AnimatedSPValue = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(value.toString().split(""));

  useEffect(() => {
    const newDigits = value.toString().split("");

    setDisplayValue((prevDigits) => {
      const maxLength = Math.max(prevDigits.length, newDigits.length);
      return Array.from({ length: maxLength }, (_, i) => newDigits[i] || "0");
    });
  }, [value]);

  return (
    <div className="overflow-hidden flex items-center justify-center flex-row gap-1">
      <div className="flex flex-row">
        {displayValue.map((digit, index) => (
          <div key={index} className="overflow-hidden h-full">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={digit}
                initial={{ y: "-100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "100%" }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                  delay: 0.1 * index,
                }}
                className="inline-block"
              >
                {digit}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </div>
      <span>SP+</span>
    </div>
  );
};

export default AnimatedSPValue;
