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
import { ArrowLeftToLine, LogOut } from "lucide-react";

export default function LeaveGroupModal({ onConfirm }: { onConfirm: () => void}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <span className="flex text-red-400 items-center">
                    <ArrowLeftToLine className="h-4 w-4 mr-2" />
                    Leave Group
                </span>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[92%]">
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                    <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                        aria-hidden="true"
                    >
                        <LogOut className="opacity-80" size={16} strokeWidth={2} />
                    </div>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to leave this group?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You will no longer be a part of this group and will lose access to its messages and updates.
                            You can rejoin if invited again.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-500 hover:bg-red-400 text-white"
                        onClick={onConfirm}
                    >
                        Leave Group
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>

        </AlertDialog>
    );
}
