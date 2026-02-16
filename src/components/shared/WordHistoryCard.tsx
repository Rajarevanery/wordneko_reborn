import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePostVocabulary } from "../../lib/react-query/mutations/mutations";
import { toast } from "sonner";

interface Category {
  category_id: string;
  category_name: string;
  vocabulary: { vocab: string }[];
}

interface WordHistoryCardProps {
  word: string;
  definition: string;
  categoryData: Category[];
  index: number;
}

const WordHistoryCard = ({
  word,
  definition,
  categoryData,
  index,
}: WordHistoryCardProps) => {
  const [isSelect, setIsSelect] = useState(false);
  const { mutateAsync: postVocabulary } = usePostVocabulary();

  useEffect(() => {
    setIsSelect(false);
  }, [word]);

  const handleAddVocab = async ({
    category_id,
    vocab,
    def,
  }: {
    category_id: string;
    vocab: string;
    def: string;
  }) => {
    try {
      await postVocabulary({
        category_id: category_id,
        vocab: vocab,
        def: def,
      });
      toast.success("Successfully added vocabulary");
    } catch (error) {
      console.error("Error adding vocab:", error);
      toast.error("Error adding vocabulary");
    }
  };

  const handleIsAlreadyAdded = (category: Category) => {
    return category.vocabulary.some((vocabItem) => vocabItem.vocab === word);
  };

  return (
    <motion.li
      key={`${word}-${index}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, type: "tween" }}
    >
      <article>
        <h1 className="text-xl font-bold font-subheader">Vocabulary: {word}</h1>
        <p className="text-sm font-paragraph opacity-40">Definition: {definition}</p>

        <div className="gap-4 flex flex-col">
          <div className="space-x-2">
            <button
              onClick={() => setIsSelect((prev) => !prev)}
              className="px-2 h-8 mt-2 font-subheader text-sm bg-blue-800 rounded-lg"
            >
              Save vocabulary
            </button>

            <a
              href={`https://www.oxfordlearnersdictionaries.com/definition/english/${word}_1?q=${word}`}
              target="_blank"
            >
              <button className="px-2 h-8 mt-2 font-subheader text-sm border-blue-800 border rounded-lg">
                See more information
              </button>
            </a>
          </div>
          <div>
            <AnimatePresence>
              {isSelect && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2 bg-blue-950 p-4 rounded-lg"
                >
                  <div className="flex flex-col">
                    <span className="font-paragraph">Your Vocabulary Category</span>

                    {categoryData.length < 1 && (
                      <span className="text-sm opacity-50">
                        No category, create a category first in the saved words section
                      </span>
                    )}
                  </div>
                  <div className="text-start font-subheader text-sm grid grid-cols-3 gap-4">
                    {categoryData?.map((item, index) => {
                      const isAlreadyAdded = handleIsAlreadyAdded(item);
                      return (
                        <button
                          disabled={isAlreadyAdded}
                          onClick={() =>
                            handleAddVocab({
                              vocab: word,
                              def: definition,
                              category_id: item.category_id,
                            })
                          }
                          key={index}
                          className="cursor-pointer flex flex-col items-center justify-center disabled:cursor-default disabled:bg-red-800 bg-blue-800 p-2 font-subheader rounded-lg hover:bg-blue-700 transition"
                        >
                          <span>{item.category_name}</span>
                          <span className="text-sm opacity-50">{isAlreadyAdded && "Added"}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </article>
    </motion.li>
  );
};

export default WordHistoryCard;
