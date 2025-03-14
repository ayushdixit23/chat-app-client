import React from "react";
import { motion } from "motion/react";
import { Camera } from "lucide-react";

interface ProfileImageSectionProps {
  imagePreview: string | File | null;
  isEditing: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  userName: string;
  profilePic:string
}

const ProfileImageSection: React.FC<ProfileImageSectionProps> = ({
    profilePic,
  imagePreview,
  isEditing,
  onImageChange,
  userName,
}) => {
  return (
    <motion.div className="flex mb-6">
      <div className="relative">
        <div className="w-24 h-24 mt-4 rounded-full overflow-hidden border-2 border-blue-500 flex items-center justify-center">
          {imagePreview || profilePic? (
            <img
              src={ imagePreview
                ? typeof imagePreview === "string"
                  ? imagePreview || profilePic
                  : URL.createObjectURL(imagePreview)
                : profilePic}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center dark:bg-[#0d0d0d] bg-gray-100">
              <span className="text-2xl font-semibold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {isEditing && (
          <motion.div
            className="absolute -bottom-2 -right-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="cursor-pointer">
              <div
                className={`p-2 rounded-full dark:bg-[#0d0d0d] bg-white shadow-lg border border-blue-500`}
              >
                <Camera size={18} className="text-blue-500" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImageChange}
              />
            </label>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileImageSection;
