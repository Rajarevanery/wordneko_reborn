import { motion } from "motion/react"

const AddVocabularyModal = () => {
  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="overflow-hidden fixed w-screen z-10 h-screen top-0 left-0 bg-slate-900/50 backdrop-blur-md flex justify-center items-center"
  >

  </motion.div>
  )
}

export default AddVocabularyModal