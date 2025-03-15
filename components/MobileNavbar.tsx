// "use client"
// import { MessageSquare, Settings, UserPlus, Users } from "lucide-react";
// import Link from "next/link";
// import { usePathname, useSearchParams } from "next/navigation";

// const MobileNavBar = () => {
//     const path = usePathname()
//     const searchParams = useSearchParams()
//     const id = searchParams.get("id")
//     return (
//         <>
//             {!id && <div className="fixed bottom-0 left-0 right-0 h-16 sm:hidden z-40 flex items-center justify-between bg-white dark:bg-[#0d0d0d] dark:text-white text-black px-7 border-t">
//                 <Link href={"/"} className="flex flex-col items-center justify-center">
//                     <MessageSquare size={20} className="cursor-pointer" />
//                     <span className="text-xs mt-1">Chat</span>
//                 </Link>

//                 <Link href={"/group"} className="flex flex-col items-center justify-center">
//                     <Users size={20} className="cursor-pointer" />
//                     <span className="text-xs mt-1">Groups</span>
//                 </Link>

//                 <Link href={"/requests"} className="flex flex-col items-center justify-center">
//                     <UserPlus size={20} className="cursor-pointer" />
//                     <span className="text-xs mt-1">Requests</span>
//                 </Link>

//                 <Link href={"/settings"} className="flex flex-col items-center justify-center">
//                     <Settings size={20} className="cursor-pointer" />
//                     <span className="text-xs mt-1">Settings</span>
//                 </Link>
//             </div>}
//         </>

//         // <></>
//     );
// };

// export default MobileNavBar;

"use client"

import { MessageSquare, Settings, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const MobileNavBar = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    // Function to determine if a path is active
    const isActive = (path:string) => {
        return pathname === path;
    };

    // Function to get the appropriate styling based on active state
    const getLinkStyles = (path:string) => {
        const baseClasses = "flex flex-col items-center justify-center";
        const activeClasses = isActive(path) ? "text-blue-500 font-medium" : "";
        return `${baseClasses} ${activeClasses}`;
    };

    return (
        <>
            {!id && (
                <div className="fixed bottom-0 left-0 right-0 h-16 sm:hidden z-40 flex items-center justify-between bg-white dark:bg-[#0d0d0d] dark:text-white text-black px-7 border-t">
                    <Link href={"/"} className={getLinkStyles("/")}>
                        <MessageSquare 
                            size={20} 
                            className={`cursor-pointer ${isActive("/") ? "fill-blue-500" : ""}`} 
                        />
                        <span className="text-xs mt-1">Chat</span>
                    </Link>

                    <Link href={"/group"} className={getLinkStyles("/group")}>
                        <Users 
                            size={20} 
                            className={`cursor-pointer ${isActive("/group") ? "fill-blue-500" : ""}`} 
                        />
                        <span className="text-xs mt-1">Groups</span>
                    </Link>

                    <Link href={"/requests"} className={getLinkStyles("/requests")}>
                        <UserPlus 
                            size={20} 
                            className={`cursor-pointer ${isActive("/requests") ? "fill-blue-500" : ""}`} 
                        />
                        <span className="text-xs mt-1">Requests</span>
                    </Link>

                    <Link href={"/settings"} className={getLinkStyles("/settings")}>
                        <Settings 
                            size={20} 
                            className={`cursor-pointer ${isActive("/settings") ? "fill-blue-500" : ""}`} 
                        />
                        <span className="text-xs mt-1">Settings</span>
                    </Link>
                </div>
            )}
        </>
    );
};

export default MobileNavBar;