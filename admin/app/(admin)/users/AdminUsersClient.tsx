"use client";

import { useMemo, useState } from "react";
import { Prisma } from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Eye } from "lucide-react";
import { RoleBadge } from "@/components/common/Badges";
import AdminSearchBar from "@/components/common/AdminSearchBar";

type UserWithCount = Prisma.UserGetPayload<{
    include: {
        _count: {
            select: {
                orders: true;
            };
        };
    };
}>;

export default function AdminUsersClient({
    users,
}: {
    users: UserWithCount[];
}) {
    const [userList] = useState(users);

    const sortedUsers = useMemo(() => userList, [userList]);

    return (
        <div className="space-y-5">

            <div className="border rounded-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-200 hover:bg-gray-200">
                            <TableHead>Username</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Total Orders</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {sortedUsers.map((user) => (
                            <TableRow key={user.id}>

                                <TableCell>
                                    {user.username || " - "}
                                </TableCell>

                                <TableCell>
                                    {user.phone || " - "}
                                </TableCell>

                                <TableCell>
                                    {user.email || " - "}
                                </TableCell>

                                <TableCell>
                                    <RoleBadge role={user.role} />
                                </TableCell>

                                <TableCell>
                                    {user._count.orders}
                                </TableCell>

                                <TableCell className="text-right">
                                    <Link
                                        href={`/users/${user.id}`}
                                        className="px-3 py-1 text-sm bg-white border border-black rounded inline-flex gap-1 items-center"
                                    >
                                        <Eye size={16} />
                                        View
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}

                        {sortedUsers.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="py-10 text-center text-gray-500"
                                >
                                    No users found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}