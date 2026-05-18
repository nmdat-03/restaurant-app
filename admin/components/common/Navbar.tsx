import { Bell, MessageSquareMore } from "lucide-react";
import UserMenu from "./UserMenu";
import CustomButton from "./CustomButton";
import { Role } from "@prisma/client";

interface NavbarProps {
    user: {
        username: string | null;
        role: Role;
    } | null;
}

export default function Navbar({ user }: NavbarProps) {
    return (
        <div className="w-full px-3 pt-3 flex gap-5 items-center justify-end">
            {/* Message */}
            <CustomButton className="w-9 h-9 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md">
                <MessageSquareMore size={18} />
            </CustomButton>
            {/* Notification */}
            <CustomButton className="relative w-9 h-9 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md">
                <Bell size={18} />
                <div className='absolute w-5 h-5 -top-2 -right-2 flex items-center justify-center rounded-full text-xs text-white bg-red-600'>1</div>
            </CustomButton>
            {/* User */}
            <div className='flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-md'>
                <div className="hidden md:flex md:flex-col">
                    <span className='text-xs leading-3 font-medium'>{user?.username || "Unknown"}</span>
                    <span className='text-[10px] text-gray-500 text-right capitalize'>{user?.role.toLowerCase()}</span>
                </div>
                <UserMenu />
            </div>
        </div>
    )
}