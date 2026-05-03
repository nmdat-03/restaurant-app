import Sidebar from "@/components/common/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen">
            <Sidebar />

            <div className="flex-1 bg-[#F7F8FA] overflow-y-auto scrollbar-hide">
                {children}
            </div>
        </div>
    );
}