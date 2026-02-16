import { motion } from "motion/react";
import { FaPlus } from "react-icons/fa6";
import { usePostCategory } from "../../lib/react-query/mutations/mutations";
import { useAuthContext } from "../../context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";

const AddCategoryModal = ({ onClose }: { onClose: () => void }) => {
  const { mutateAsync: postCategory, status } = usePostCategory();
  const { user_id } = useAuthContext();

  const [categoryName, setCategoryName] = useState<string>();

  const handleSubmit = async () => {
    if (!categoryName) {
      toast.error("Please fill in the category name");
      return;
    }

    if (!user_id) {
      toast.error("User not found!");
      return;
    }

    try {
      if (status === 'idle') {
        await postCategory({
          category_name: categoryName,
          user_id: user_id,
        });
      }
      onClose();
    } catch (error) {
      throw new Error("Error inside the category modal.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overflow-hidden fixed w-screen z-20 h-screen top-0 left-0 bg-slate-900/50 backdrop-blur-md flex justify-center items-center"
    >
      <div className="max-w-2xl bg-slate-800 p-6 rounded-lg w-full text-white flex flex-col">
        <button
          className="w-24 py-1 rounded-lg text-xl bg-slate-700 font-subheader"
          onClick={onClose}
        >
          Close
        </button>
        <fieldset className="font-paragraph">
          <div className="flex flex-col">
            <label htmlFor="category" className="text-lg text-slate-400 my-4">
              Name your category.
            </label>
            <div className="border-slate-500 border-b flex flex-row p-1">
              <input
                type="text"
                className="p-1 appearance-none bg-slate-800 outline-none flex flex-1"
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <button
                className="px-2 bg-slate-700 rounded-lg"
                onClick={handleSubmit}
              >
                <i>
                  <FaPlus />
                </i>
              </button>
            </div>
          </div>

          <p className="mt-4 opacity-50">
            This will be a category where you can organize and add new
            vocabulary words.
          </p>
        </fieldset>
      </div>
    </motion.div>
  );
};

export default AddCategoryModal;
