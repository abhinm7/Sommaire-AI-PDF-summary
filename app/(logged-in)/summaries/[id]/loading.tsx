import BgGradient from "@/components/common/bg-gradient";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingSkeleton from "@/components/upload/loading-skeleton";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

// Header skeleton component
function HeaderSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
                <Skeleton className="h-8 w-32 rounded-full bg-white/80" />
                <Skeleton className="h-5 w-40 rounded-full bg-white/80" />
            </div>
            <Skeleton className="h-12 w-3/4 rounded-full bg-white/80" />
        </div>
    );
}


// Content skeleton component
function ContentSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn(
                        "h-4",
                        i % 2 === 0 ? "w-full" : "w-11/12 bg-white/80"
                    )}
                />
            ))}
        </div>
    );
}

// Main loading summary component
export default function LoadingSummary() {
    return (
        <div className="relative isolate min-h-screen bg-gradient-to-b from-rose-50/40 to-white">
            <BgGradient className="from-rose-400 via-rose-300 to-orange-200" />

            <div className="container mx-auto flex flex-col gap-4">
                <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-24">
                    <div className="flex flex-col gap-8">
                        <HeaderSkeleton />

                        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center justify-center gap-2">
                                <FileText className="h-4 w-4 text-rose-400" />
                                <Skeleton className="w-12" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="w-12 h-12" />
                                <Skeleton className="w-12 h-12" />
                            </div>
                        </div>

                        <div className="relative overflow-hidden">
                            <div className="relative p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-rose-100/30">
                                {/* Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-orange-50/30 to-transparent opacity-50 rounded-3xl" />
                            </div>
                        </div>

                        {/** Icon */}
                        <div className="absolute top-4 right-4 text-rose-300/20">
                            <Skeleton className="h-3 w-3 sm:h-4 sm:w-4 text-rose-400" />
                        </div>

                        <div className="relative">
                            <LoadingSkeleton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
