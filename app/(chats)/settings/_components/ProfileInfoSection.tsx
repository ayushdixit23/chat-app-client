import React from "react";
import { Button } from "@/components/ui/button";
import {motion} from "motion/react"

interface ProfileInfoSectionProps {
  user: any;
  startEditing: () => void;
}

const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({ user, startEditing }) => {
  return (
    <motion.div
      className="space-y-4"
      transition={{ staggerChildren: 0.1 }}
    >
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-sm font-medium opacity-70">Name</h3>
          <p className="text-lg font-medium">{user?.fullName}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium opacity-70">Username</h3>
          <p className="text-lg">@{user?.userName}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium opacity-70">Email</h3>
          <p className="text-lg">{user?.email}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium opacity-70">About</h3>
          <p className="text-lg">{user?.about}</p>
        </div>
        <div className="pt-4 flex justify-start items-end">
          <Button
            onClick={startEditing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Edit Profile
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileInfoSection;
