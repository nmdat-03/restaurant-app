import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container py-3">
            <div className="flex gap-6">

                {/* FILTER */}
                <div className="hidden lg:block w-1/4">
                    <div className="bg-white p-4 rounded-lg shadow-md space-y-6">

                        {/* Title */}
                        <Skeleton className="h-7 w-20" />

                        {/* Category section */}
                        <div className="space-y-4">

                            {/* Category label */}
                            <Skeleton className="h-5 w-24" />

                            {/* Checkbox list */}
                            <div className="flex flex-col gap-4">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Skeleton className="w-5 h-5 rounded-sm" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-1/2 rounded-md" />
                            <Skeleton className="h-10 w-1/2 rounded-md" />
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="w-full lg:w-3/4 flex flex-col">

                    {/* Mobile filter */}
                    <div className="flex md:hidden mb-4">
                        <Skeleton className="h-10 w-32 rounded-md" />
                    </div>

                    {/* TOP BAR */}
                    <div className="flex items-center justify-between mb-4">

                        {/* Title */}
                        <Skeleton className="h-6 w-48" />

                        {/* SortBar Skeleton */}
                        <Skeleton className="h-8 w-35 rounded-md" />

                    </div>

                    {/* PRODUCT GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="bg-white p-3 rounded-xl shadow-md">
                                <Skeleton className="aspect-square w-full rounded-lg" />
                                <div className="mt-3 space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}