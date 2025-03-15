import React, { useEffect, useState, useMemo } from "react";
import { MoreVertical, UserRoundPlus, UsersRound } from "lucide-react";
import { Socket } from "socket.io-client";
import useFeatures from "@/app/zustand/stores/feature";
import { motion, AnimatePresence } from "framer-motion";
import ClearChats from "./modals/ClearChatModal";
import BlockOrUnblockUser from "./modals/BlockUserModal";
import AddMembersPopup from "./modals/AddMembersPopup";
import { errorHandler } from "@/app/utils/helper";
import axios from "axios";
import { API } from "@/app/utils/constants";
import { toast } from "react-toastify";
import LeaveGroupModal from "./modals/LeaveGroupModal";
import DeleteGroupModal from "./modals/DeleteGroupModal";
import { useRouter } from "next/navigation";
import GroupDetailsModal from "./modals/GroupDetailsModal";

interface MessageHeaderProps {
  id: string;
  data: any;
  socket: Socket | null;
  userId: string;
  clearChats: () => void;
  accessToken: string;
  blockOrUnBlockUser: () => void;
  queryClient: any;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({
  accessToken,
  queryClient,
  id,
  data,
  socket,
  userId,
  clearChats,
  blockOrUnBlockUser,
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { onlineUsers } = useFeatures((state) => state);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const isGroup = data?.conversation?.isGroup;
  const chatName = isGroup
    ? data?.conversation?.groupName
    : data?.conversation?.otherUser?.fullName;
  const chatPic = isGroup
    ? data?.conversation?.groupPic
    : data?.conversation?.otherUser?.profilePic;
  const otherUserId = data?.conversation?.otherUser?._id;
  const isBlockedByYou = data?.conversation.isBlockedByYou;
  const isUserAdmin = data?.conversation?.groupAdmin === userId;
  const [showGroupDetails, setShowGroupDetails] = useState(false);


  // Compute online users in the group
  const groupUsersOnline = useMemo(() => {
    return (
      data?.conversation?.groupUsers?.filter(
        (d: any) => onlineUsers.includes(d._id) && d._id !== userId
      ) || []
    );
  }, [data?.conversation?.groupUsers, onlineUsers]);

  const isUserOnline = useMemo(() => {
    return onlineUsers.includes(otherUserId);
  }, [onlineUsers, otherUserId]);

  useEffect(() => {
    if (!data || !socket) return;

    const handleTyping = (socketData: any) => {
      if (
        socketData?.conversationId === data.conversation.conversationId &&
        socketData.senderId !== userId
      ) {
        if (socketData.isGroup) {
          setUser(socketData.fullName);
        }
        setIsTyping(true);
      }
    };

    const handleNotTyping = (socketData: any) => {
      if (
        socketData?.conversationId === data.conversation.conversationId &&
        socketData.senderId !== userId
      ) {
        if (socketData.isGroup) {
          setUser(null);
        }
        setIsTyping(false);
      }
    };

    socket.on("typing", handleTyping);
    socket.on("not-typing", handleNotTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("not-typing", handleNotTyping);
    };
  }, [socket, data, userId]);

  const handleClearChat = () => {
    // Implement clear chat functionality
    console.log("Clear chat");
    clearChats();
    setShowDropdown(false);
  };

  const handleBlockingUser = () => {
    blockOrUnBlockUser();
    console.log("Block user");
    setShowDropdown(false);
  };

  // Animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -5,
      scale: 0.95,
      transition: { duration: 0.15 },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: -5,
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  // Button hover animation
  const buttonHoverVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
  };

  const onCancel = () => {
    setShowDropdown(false);
  };
  const onClose = () => {
    setIsOpen(false);
  };

  const onAddMembers = async (members: string[]) => {
    try {
      const res = await axios.post(
        `${API}/chats/add-members/${id}`,
        { members },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        queryClient.invalidateQueries({ queryKey: ["getChat", id] });
      } else {
        toast.success(res.data.message || "Something Went Wrong!");
      }
    } catch (error) {
      errorHandler(error);
    }
    finally{
      onClose()
    }
  };

  const handleUserLeave = async () => {
    try {
      const res = await axios.post(
        `${API}/chats/leave-group/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(`Leaved ${chatName} successfully!`);
        queryClient.invalidateQueries({ queryKey: ["allChats"] });
        queryClient.invalidateQueries({ queryKey: ["getGroups"] });

        router.push("/");
      } else {
        toast.success(res.data.message || "Something Went Wrong!");
      }
    } catch (error) {
      console.log(error);
      errorHandler(error);
    }
  };

  const onRemoveMembers = async (members: string[]) => {
    try {
      const res = await axios.post(
        `${API}/chats/remove-members/${id}`,
        { members },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        queryClient.invalidateQueries({ queryKey: ["getChat", id] });

      } else {
        toast.success(res.data.message || "Something Went Wrong!");
      }
    } catch (error) {
      console.log(error);
      errorHandler(error);
    } finally {
      setShowGroupDetails(false)
    }
  };

  const handleGroupDelete = async () => {
    try {
      const res = await axios.delete(`${API}/chats/delete-group/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        toast.success(`Deleted ${chatName} successfully!`);
        queryClient.invalidateQueries({ queryKey: ["allChats"] });
        queryClient.invalidateQueries({ queryKey: ["getGroups"] });

        router.push("/");
      } else {
        toast.success(res.data.message || "Something Went Wrong!");
      }
    } catch (error) {
      console.log(error);
      errorHandler(error);
    }
  };

  return (
    <>
      <div onClick={() => setShowDropdown(false)} className={` fixed inset-0 ${showDropdown ? "z-10" : "-z-10"}`}></div>
      <AddMembersPopup
        isOpen={isOpen}
        onClose={onClose}
        userId={userId}
        groupId={id}
        onAddMembers={onAddMembers}
      />

      <GroupDetailsModal
        onRemoveMembers={onRemoveMembers}
        isOpen={showGroupDetails}
        onClose={() => setShowGroupDetails(false)}
        groupData={data.conversation}
        isAdmin={isUserAdmin}
        onAddMembers={() => {
          setShowGroupDetails(false);
          setIsOpen(true); // Open your existing AddMembersPopup
        }}
      />

      <div className="p-4 bg-white dark:bg-[#0d0d0d] dark:text-white border-b light:border-gray-200">
        <div className="flex items-center">
          {/* Profile Picture */}
          <motion.div
            className="w-10 h-10 rounded-full overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={chatPic}
              alt={chatName}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Chat Info */}
          <motion.div
            className="ml-4 flex-1"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold dark:text-white text-gray-900">
                  {chatName}
                </h2>
                <motion.p
                  className="text-sm text-green-500"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{
                    repeat: isTyping ? Infinity : 0,
                    duration: 1.5,
                  }}
                >
                  {isTyping
                    ? user
                      ? `${user} is typing...`
                      : "typing..."
                    : isGroup
                      ? groupUsersOnline.length > 0
                        ? groupUsersOnline.length === 1
                          ? `${groupUsersOnline[0].fullName.split(" ")[0]
                          } is online`
                          : `${groupUsersOnline[0].fullName.split(" ")[0]} and ${groupUsersOnline.length - 1
                          } others are online`
                        : "No one is online!"
                      : isUserOnline
                        ? "Online"
                        : "Offline"}
                </motion.p>
              </div>

              {/* Action Buttons */}
              <motion.div
                className="flex items-center space-x-2"
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {isGroup && isUserAdmin && (
                  <motion.button
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    variants={buttonHoverVariants}
                    onClick={() => {
                      setIsOpen(true);
                    }}
                    initial="rest"
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                  >
                    <UserRoundPlus className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </motion.button>
                )}

                <div className="relative">
                  <motion.button
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(!showDropdown);
                    }}
                    variants={buttonHoverVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                    animate={showDropdown ? { rotate: 90 } : { rotate: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-background rounded-md shadow-lg z-10 border  overflow-hidden"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                      >
                        <ul>
                          <motion.li
                            whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                            whileTap={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                          >
                            <button className="flex items-center w-full mt-1 px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                              <motion.span
                                initial={{ x: -5, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="flex items-center"
                              >
                                <ClearChats
                                  onCancel={onCancel}
                                  onConfirm={handleClearChat}
                                />
                              </motion.span>
                            </button>
                          </motion.li>
                          {!isGroup && (
                            <motion.li
                              whileHover={{
                                backgroundColor: "rgba(0,0,0,0.05)",
                              }}
                              whileTap={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                            >
                              <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400">
                                <motion.span
                                  initial={{ x: -5, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                  className="flex items-center"
                                >
                                  <BlockOrUnblockUser
                                    blocked={isBlockedByYou}
                                    onCancel={onCancel}
                                    onConfirm={handleBlockingUser}
                                  />
                                </motion.span>
                              </button>
                            </motion.li>
                          )}

                          {isGroup && (
                            <motion.li
                              whileHover={{
                                backgroundColor: "rgba(0,0,0,0.05)",
                              }}
                              whileTap={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                            >
                              <button
                                onClick={() => {
                                  setShowDropdown(false);
                                  setShowGroupDetails(true);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400">
                                <motion.span
                                  initial={{ x: -5, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                  className="flex items-center"
                                >
                                  <span className="flex items-center">
                                    <UsersRound className="h-4 w-4 mr-2" />
                                    View Members
                                  </span>
                                </motion.span>
                              </button>
                            </motion.li>
                          )}

                          {isGroup && isUserAdmin ? (
                            <motion.li
                              whileHover={{
                                backgroundColor: "rgba(0,0,0,0.05)",
                              }}
                              whileTap={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                            >
                              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                                <motion.span
                                  initial={{ x: -5, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: 0.1 }}
                                  className="flex items-center"
                                >
                                  <DeleteGroupModal onConfirm={handleGroupDelete} />
                                </motion.span>
                              </button>
                            </motion.li>
                          ) : (
                            <>
                              {isGroup && (
                                <motion.li
                                  whileHover={{
                                    backgroundColor: "rgba(0,0,0,0.05)",
                                  }}
                                  whileTap={{
                                    backgroundColor: "rgba(0,0,0,0.1)",
                                  }}
                                >
                                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                                    <motion.span
                                      initial={{ x: -5, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ delay: 0.1 }}
                                      className="flex items-center"
                                    >
                                      <LeaveGroupModal
                                        onConfirm={handleUserLeave}
                                      />
                                    </motion.span>
                                  </button>
                                </motion.li>
                              )}
                            </>
                          )}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default MessageHeader;
