import React, { useRef, useState } from "react";
import { Camera, Video, FileText, File, Plus, X } from "lucide-react";
import useMessageStore, { value } from "@/app/zustand/stores/message";
import { motion, AnimatePresence } from "motion/react";

const options = [
  { label: "image", icon: Camera, accept: "image/*" },
  { label: "video", icon: Video, accept: "video/*" },
  { label: "gif", icon: FileText, accept: "image/gif" },
  { label: "document", icon: File, accept: ".pdf,.doc,.docx,.txt,.zip" },
];

const DropdownButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const { setMedia, setMessageType } = useMessageStore((state) => state);

  const handleFileClick = (fileType: string) => {
    setIsExpanded(!isExpanded);
    if (fileInput.current) {
      fileInput.current.accept = fileType;
      fileInput.current.click();
      setIsExpanded(false);
    }
  };

  return (
    <>
      <div className="relative">
        <div
          className="rounded-full hover:bg-accent hover:text-accent-foreground w-9 h-9 p-3 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-none"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Close menu" : "Open menu"}
        >
          {isExpanded ? (
            <X className="w-9 h-9" aria-hidden="true" />
          ) : (
            <Plus className="w-9 h-9" aria-hidden="true" />
          )}
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute rounded-xl min-w-[170px] bg-white dark:bg-[#0d0d0d] p-2 border -top-[213px] shadow-lg"
            >
              {options.map(({ label, icon: Icon, accept }) => (
                <button
                  key={label}
                  className="p-2 w-full flex items-center gap-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => handleFileClick(accept)}
                >
                  <div className="bg-background flex size-8 items-center justify-center rounded-md border">
                    <Icon size={16} className="opacity-60" />
                  </div>
                  <span className="text-sm font-medium">
                    {label.charAt(0).toUpperCase() + label.slice(1)}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={fileInput}
          type="file"
          className="hidden"
          onChange={(e) => {
            const input = e.target;
            if (input.files?.length) {
              const file = input.files[0];
              setMedia(file);
              if (file.type.startsWith("image")) {
                setMessageType("image");
              } else if (file.type.startsWith("video")) {
                setMessageType("video");
              } else if (
                file.type.startsWith("application") ||
                file.type.startsWith("text")
              ) {
                setMessageType("document");
              } else {
                setMessageType("text");
              }
            } else {
              setMessageType("text");
              setMedia(null);
            }

            input.value = "";
          }}
        />
      </div>
    </>
  );
};

export default DropdownButton;
