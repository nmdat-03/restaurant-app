import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const user = await requireAdmin();

    return (
        <div className="flex h-screen">
            <Sidebar />

            <div className="flex-1 bg-[#F7F8FA] overflow-y-auto scrollbar-hide">
                <Navbar user={user} />
                {children}
            </div>
        </div>
    );
}