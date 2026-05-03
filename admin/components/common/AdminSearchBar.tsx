"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

type AdminSearchBarProps = {
    basePath: string;
    placeholder: string;
};

export default function AdminSearchBar({
    basePath,
    placeholder,
}: AdminSearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [value, setValue] = useState(
        searchParams.get("q") || ""
    );

    useEffect(() => {
        setValue(searchParams.get("q") || "");
    }, [searchParams]);

    const handleSubmit = (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const params = new URLSearchParams(
            searchParams.toString()
        );

        if (value.trim()) {
            params.set("q", value.trim());
        } else {
            params.delete("q");
        }

        params.set("page", "1");

        router.push(
            `${basePath}?${params.toString()}`
        );
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="relative w-72"
        >
            <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
                value={value}
                onChange={(e) =>
                    setValue(e.target.value)
                }
                placeholder={placeholder}
                className="h-9 w-full rounded-md border pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
            />
        </form>
    );
}