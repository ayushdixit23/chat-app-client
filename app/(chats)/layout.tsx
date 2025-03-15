import MobileNavBar from "@/components/MobileNavbar";
import Sidebar from "@/components/Sidebar";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-screen h-screen">
            <MobileNavBar/>
            <div className="w-full sm:mb-0 flex h-full">
                <Sidebar />
               
                {children}
            </div>
        </div>
    );
}