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
import { Trash2 } from "lucide-react";

export default function DeleteGroupModal({ onConfirm }: { onConfirm: () => void }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <span className="flex text-red-600 items-center">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Group
                </span>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                    <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                        aria-hidden="true"
                    >
                        <Trash2 className="opacity-80" size={16} strokeWidth={2} />
                    </div>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this group?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action is **permanent**. Deleting this group will remove all messages, members, and data associated with it.
                            This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        asChild
                        className="bg-red-600 hover:bg-red-500 text-white"
                    >
                        <button
                            onClick={onConfirm}
                            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Delete Group
                        </button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

