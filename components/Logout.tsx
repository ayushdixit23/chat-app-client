import { logOut } from "@/actions/auth";
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
import { CircleAlert, LogOut } from "lucide-react";

export default function Logout() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span className="flex justify-center items-center gap-2 bg-red-600 sm:bg-transparent p-1.5 dark:text-white rounded-md -pl-2">
          <LogOut size={20} className="cursor-pointer text-white sm:text-black dark:sm:text-white sm:hover:text-red-500" />
          <span className="sm:hidden text-white">Log Out</span>
        </span>

      </AlertDialogTrigger>
      <AlertDialogContent className="w-[95%]">
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out of your account. Make sure you’ve saved your work before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={logOut} >Log Out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
