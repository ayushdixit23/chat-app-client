import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAddFriends } from "@/actions/chats";
import Loader from "../Loader";
import ErrorPage from "../ErrorPage";

export interface Member {
  _id: string;
  fullName: string
  userName: string
  profilePic: string
  isAdmin?:boolean
}

interface AddMembersPopupProps {
  userId: string,
  groupId: string
  isOpen: boolean;
  onClose: () => void;
  onAddMembers: (selectedMembers: string[]) => void;
}

export default function AddMembersPopup({ groupId, userId, isOpen, onClose, onAddMembers }: AddMembersPopupProps) {
  const [search, setSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getAddFriends", groupId],
    queryFn: ({ queryKey }) => getAddFriends(queryKey[1]),
    enabled: !!groupId,
  })


  if (isLoading) return <Loader />;
  if (isError) return <ErrorPage message={error.message} />;

  const filteredMembers = data?.users?.filter((member: Member) =>
    member.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const toggleMember = (member: Member) => {
    setSelectedMembers((prev) =>
      prev.includes(member._id)
        ? prev.filter((id) => id !== member._id)
        : [...prev, member._id]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 bg-white dark:bg-[#0d0d0d] shadow-lg rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Members</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
            className="w-full p-2 pl-8 rounded-lg border light:border-gray-300 focus:outline-none light:focus:border-blue-500 dark:bg-transparent bg-gray-50"
          />
          <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex flex-col gap-3 max-h-[270px] overflow-y-auto">
          {filteredMembers.map((member: Member) => (
            <div
              key={member._id}
              className="flex justify-between items-center p-2 border rounded-md cursor-pointer "
              onClick={() => toggleMember(member)}
            >
              <div className="flex items-center p-2">
                <img
                  src={member.profilePic}
                  alt={member.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="font-medium dark:text-white text-gray-900">
                    {member.fullName}
                  </h3>
                  <p className="text-sm dark:text-white text-gray-500">
                    {member.userName}
                  </p>
                </div>
              </div>
              {selectedMembers.includes(member._id) && <CheckCircle size={20} className="text-green-500 mr-2" />}
            </div>
          ))}
        </div>

        <Button
          onClick={() => {
            onAddMembers(selectedMembers)
            setSelectedMembers([])
          }}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Add Selected Members
        </Button>
      </DialogContent>
    </Dialog>
  );
}
