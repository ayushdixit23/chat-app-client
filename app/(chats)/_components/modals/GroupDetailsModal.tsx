import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Users,
    Clock,
    Info,
    ChevronRight,
    UserRoundPlus,
    Trash2,
    CheckSquare,
    Square
} from "lucide-react";
import { Member } from "./AddMembersPopup";
import { formatDate, formatDateTime } from "@/app/utils/helper";

const GroupDetailsModal = ({
    isOpen,
    onClose,
    groupData,
    isAdmin,
    onAddMembers,
    onRemoveMembers,
}: {
    isOpen: any;
    onClose: any;
    groupData: any;
    isAdmin: any;
    onAddMembers: any;
    onRemoveMembers: (memberIds: string[]) => void;
}) => {
    const [activeTab, setActiveTab] = useState("about");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [selectMode, setSelectMode] = useState(false);

    if (!groupData) return null;

    const {
        groupName,
        groupDescription,
        createdAt,
        groupUsers = [],
        groupPic,
    } = groupData;

    const createdByUsers = groupUsers.filter((d: Member) => d.isAdmin);
    const createdBy = createdByUsers[0].fullName;

    const modalVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
    };

    const tabVariants = {
        inactive: { borderBottom: "2px solid transparent" },
        active: { borderBottom: "2px solid #22c55e" },
    };

    const toggleSelectMode = () => {
        setSelectMode(!selectMode);
        setSelectedMembers([]);
    };

    const toggleMemberSelection = (memberId: string) => {
        if (selectedMembers.includes(memberId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== memberId));
        } else {
            setSelectedMembers([...selectedMembers, memberId]);
        }
    };

    const handleRemoveMembers = () => {
        if (selectedMembers.length > 0 && onRemoveMembers) {
            onRemoveMembers(selectedMembers);
            setSelectedMembers([]);
            setSelectMode(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div
                        className="absolute inset-0 bg-black/50 z-50"
                        onClick={onClose}
                    ></div>
                    <motion.div
                        className="fixed right-0 bottom-0 top-0 transform bg-white dark:bg-[#1a1a1a] rounded-lg shadow-xl z-50 w-full max-w-md overflow-hidden"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Header */}
                        <div className="relative">
                            <div className="h-64 bg-gray-200 dark:bg-gray-800 flex items-center justify-center relative">
                                {groupPic ? (
                                    <img
                                        src={groupPic}
                                        alt={groupName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                                        <Users className="w-16 h-16 text-gray-500 dark:text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <button
                                className="absolute top-4 right-4 bg-gray-800/50 text-white p-2 rounded-full"
                                onClick={onClose}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Group Name */}
                        <div className="px-6 pt-4 pb-2 border-b dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold dark:text-white">
                                    {groupName}
                                </h2>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Created by {createdBy} • {formatDate(createdAt)}
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b dark:border-gray-700">
                            <motion.button
                                className={`flex-1 py-3 text-center ${activeTab === "about"
                                        ? "text-green-500"
                                        : "text-gray-600 dark:text-gray-300"
                                    }`}
                                onClick={() => setActiveTab("about")}
                                variants={tabVariants}
                                animate={activeTab === "about" ? "active" : "inactive"}
                            >
                                About
                            </motion.button>
                            <motion.button
                                className={`flex-1 py-3 text-center ${activeTab === "members"
                                        ? "text-green-500"
                                        : "text-gray-600 dark:text-gray-300"
                                    }`}
                                onClick={() => setActiveTab("members")}
                                variants={tabVariants}
                                animate={activeTab === "members" ? "active" : "inactive"}
                            >
                                Members
                            </motion.button>
                        </div>

                        {/* Tab Content */}
                        <div className="max-h-full overflow-y-auto">
                            {activeTab === "about" && (
                                <div className="p-6 flex flex-col gap-5">
                                    {/* Description */}
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                                            <Info className="w-4 h-4 mr-2" />
                                            Description
                                        </h3>
                                        <div className="flex items-start justify-between">
                                            <p className="text-gray-800 dark:text-gray-200">
                                                {groupDescription || "No description available"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Created Date */}
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                                            <Clock className="w-4 h-4 mr-2" />
                                            Created
                                        </h3>
                                        <p className="text-gray-800 dark:text-gray-200">
                                            {formatDateTime(createdAt)}
                                        </p>
                                    </div>

                                    {/* Members Count */}
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                                            <Users className="w-4 h-4 mr-2" />
                                            Members
                                        </h3>
                                        <button
                                            className="w-full flex items-center justify-between py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg pl-2 pr-4"
                                            onClick={() => setActiveTab("members")}
                                        >
                                            <span>{groupUsers.length} participants</span>
                                            <ChevronRight className="w-5 h-5 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "members" && (
                                <div className="pb-4">
                                    {/* Admin Controls */}
                                    {isAdmin && (
                                        <div className="p-4 border-b dark:border-gray-700">
                                            <div className="flex justify-between items-center">
                                                <button
                                                    className="flex items-center text-green-500 font-medium"
                                                    onClick={onAddMembers}
                                                >
                                                    <UserRoundPlus className="w-5 h-5 mr-2" />
                                                    Add members
                                                </button>

                                                {groupUsers.length > 1 && <button
                                                    className={`flex items-center font-medium text-red-500`}
                                                    onClick={toggleSelectMode}
                                                >
                                                    {selectMode ? "Cancel" : "Remove Users"}
                                                </button>}
                                            </div>

                                            {/* Remove Members Button - Only visible when members are selected */}
                                            {selectMode && selectedMembers.length > 0 && (
                                                <div className="mt-3 flex items-center justify-between">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {selectedMembers.length} member{selectedMembers.length > 1 ? 's' : ''} selected
                                                    </span>
                                                    <button
                                                        className="px-3 py-1 bg-red-500 text-white rounded-md flex items-center"
                                                        onClick={handleRemoveMembers}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Members List */}
                                    <div className="divide-y dark:divide-gray-700">
                                        {groupUsers.map((member: Member , index: number) => (
                                            <div
                                                key={index}
                                                className={`flex items-center p-4 ${selectMode ? "cursor-pointer" : ""
                                                    } ${selectMode && selectedMembers.includes(member._id || `member-${index}`)
                                                        ? "bg-gray-100 dark:bg-gray-800"
                                                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                                                    }`}
                                                onClick={
                                                    selectMode && isAdmin && !member.isAdmin
                                                        ? () => toggleMemberSelection(member._id || `member-${index}`)
                                                        : undefined
                                                }
                                            >
                                                {/* Checkbox for selection mode (admin only) */}
                                                {selectMode && isAdmin && (
                                                    <div className="mr-3">
                                                        {!member.isAdmin ? (
                                                            selectedMembers.includes(member._id || `member-${index}`) ? (
                                                                <CheckSquare className="w-5 h-5 text-green-500" />
                                                            ) : (
                                                                <Square className="w-5 h-5 text-gray-400" />
                                                            )
                                                        ) : (
                                                            <div className="w-5" /> // Spacer for admins
                                                        )}
                                                    </div>
                                                )}

                                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mr-3">
                                                    {member.profilePic ? (
                                                        <img
                                                            src={member.profilePic}
                                                            alt={member.fullName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-700">
                                                            <span className="text-xl font-medium text-gray-600 dark:text-gray-200">
                                                                {member.fullName?.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                                        {member.fullName}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                        {member.userName}
                                                    </p>
                                                </div>
                                                {member.isAdmin && (
                                                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                                                        Admin
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {/* <div className="p-4 border-t dark:border-gray-700">
                            <button
                                className="w-full py-2 text-center rounded-lg bg-red-500 text-white font-medium"
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div> */}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default GroupDetailsModal;