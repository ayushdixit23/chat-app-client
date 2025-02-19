import Sidebar from "@/components/Sidebar";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-screen h-screen">
            <div className="w-full flex h-full">
                <Sidebar />

                {children}
            </div>
        </div>
    );
}