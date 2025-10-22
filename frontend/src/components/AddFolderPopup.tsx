import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { X, FolderPlus } from "lucide-react";
import { useAddFolderMutation } from "../queries/folderqueries";

interface AddFolderPopupProps {
  onClose: () => void;
}

const AddFolderPopup = ({ onClose }: AddFolderPopupProps) => {
  const [folderName, setFolderName] = useState("");
  const { mutate: addFolder, isPending } = useAddFolderMutation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    addFolder(folderName.trim(), {
      onSuccess: () => {
        setFolderName("");
        onClose();
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-[100]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0f0d14] border border-[#2d2740] rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1f1a2e]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <FolderPlus className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-[#e8e3f5]">
              Create New Folder
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#1a1625] text-[#8b7fa8] hover:text-[#c4b8e0] transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label
              htmlFor="folderName"
              className="block text-sm font-medium text-[#c4b8e0] mb-2"
            >
              Folder Name
            </label>
            <input
              type="text"
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name..."
              className="w-full px-4 py-3 bg-[#0a070f] border border-[#2d2740] rounded-lg text-[#e8e3f5] placeholder-[#6b5f88] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
              autoFocus
              required
              disabled={isPending}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2.5 bg-[#1a1625] hover:bg-[#201a2e] text-[#c4b8e0] rounded-lg border border-[#2d2740] transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !folderName.trim()}
              className="px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4" />
                  Create Folder
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddFolderPopup;
