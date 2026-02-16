import { BiSave } from "react-icons/bi";
import AddCategoryModal from "../../components/shared/AddCategoryModal";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { useUserCategoryContext } from "../../context/UserCategoryContext";
import {
  useDeleteCategory,
  useDeleteVocabulary,
} from "../../lib/react-query/mutations/mutations";
import { toast } from "sonner";

type Vocabulary = {
  id: string;
  vocab: string;
  def: string;
};

type Category = {
  category_id: string;
  category_name: string;
  vocabulary: Vocabulary[];
};

const Saved = () => {
  const [isModal, setIsModal] = useState<boolean>(false);
  const { data: categoryData }: { data: Category[] | undefined } = useUserCategoryContext();

  const { mutateAsync: deleteCategory } = useDeleteCategory();
  const { mutateAsync: deleteVocabulary } = useDeleteVocabulary();

  const handleDeleteCategory = async (category_id: string) => {
    try {
      await deleteCategory(category_id);
      toast.success("Successfully deleted category.");
    } catch (error) {
      console.log(error);
      throw new Error("Error deleting category");
    }
  };

  const handleDeleteVocabulary = async (id: any) => {
    try {
      await deleteVocabulary(id);
      toast.success("Successfully deleted vocabulary.");
    } catch (error) {
      console.log(error);
      throw new Error("Error deleting vocabulary");
    }
  };


  return (
    <>
      <AnimatePresence>
        {isModal && <AddCategoryModal onClose={() => setIsModal(false)} />}
      </AnimatePresence>

      <div className="font-paragraph mx-auto text-white max-w-7xl h-[5rem] mt-[1rem] bg-slate-800 p-6 rounded-lg rounded-b-none flex flex-row items-center gap-6">
        <i className="text-4xl">
          <BiSave />
        </i>
        <div>
          <h2 className="font-subheader text-2xl">Saved Words</h2>
          <p className="opacity-50">
            This is currently only exclusive to spelling bee.
          </p>
        </div>
      </div>
      <section className="max-w-7xl grid grid-cols-1 mb-2 gap-6 p-6 bg-slate-900 w-full mx-auto rounded-lg">
        <button
          onClick={() => setIsModal(true)}
          className="bg-slate-800 border border-slate-600 h-[15rem] select-none transition hover:bg-slate-700 cursor-pointer p-2 rounded-lg grid place-items-center"
        >
          <div className="text-center text-white">
            <span className="font-subheader font-semibold text-xl">
              Add Category
            </span>
            <p className="font-paragraph text-sm opacity-50">
              Please add a category first before inserting any vocabulary.
            </p>
          </div>
        </button>
        {categoryData?.map((item, index) => {
          return (
            <div
              className={`text-white max-h-[25rem] w-full overflow-scroll font-subheader relative 
               `}
              key={index}
            >
              <div className="w-full bg-slate-700/60 backdrop-blur-md p-3 flex flex-row justify-between sticky top-0 z-10">
                <h2 className="text-lg font-subheader font-semibold">
                  {item.category_name}
                </h2>
                <button
                  onClick={() => handleDeleteCategory(item.category_id)}
                  className="border-red-600 border transition p-1 rounded-lg px-2 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
              <ul className="space-y-4 bg-slate-800 p-2">
                {item.vocabulary.map((item, idx) => {
                  return (
                    <div className="bg-blue-900 p-2 rounded-lg" key={idx}>
                      <div>
                        <p>{item.vocab}</p>
                        <span className="opacity-50 text-sm">{item.def}</span>
                      </div>

                      <button
                        onClick={() => handleDeleteVocabulary(item.id)}
                        className="mt-2 underline text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}

                <span className="opacity-50">
                  {item.vocabulary.length < 1 && "No Items"}
                </span>
              </ul>
            </div>
          );
        })}
      </section>
    </>
  );
};

export default Saved;
