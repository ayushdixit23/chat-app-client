import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UserX, UserCheck, Ban } from "lucide-react";

export default function BlockOrUnblockUser({ blocked = false, onConfirm, onCancel }: { blocked: any, onConfirm: () => void, onCancel: () => void }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {blocked ? (
                    <span className="flex items-center">
                        <Ban className="h-4 w-4 mr-2" />
                        UnBlock User
                    </span>

                ) : (
                    <span className="flex items-center">
                        <Ban className="h-4 w-4 mr-2" />
                        Block User
                    </span>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                    <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                        aria-hidden="true"
                    >
                        {blocked ? (
                            <UserCheck className="opacity-80" size={16} strokeWidth={2} />
                        ) : (
                            <UserX className="opacity-80" size={16} strokeWidth={2} />
                        )}
                    </div>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {blocked
                                ? "Are you sure you want to unblock this user?"
                                : "Are you sure you want to block this user?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {blocked
                                ? "This user will be able to message you and interact with your content again."
                                : "This user will no longer be able to message you or interact with your content. You can unblock them later if needed."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className={`${blocked ? "bg-green-500 hover:bg-green-400" : "bg-red-500 hover:bg-red-400"} text-white`}
                        onClick={onConfirm}
                    >
                        {blocked ? "Unblock User" : "Block User"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
