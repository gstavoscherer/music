const PlaylistSkeleton = () => {
    return (
        <div className="space-y-1">
            {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="p-2 rounded-md flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-800 rounded-md flex-shrink-0 animate-pulse" />
                    <div className="flex-1 space-y-2 md:block hidden">
                        <div className="h-4 bg-gray-800 rounded-md animate-pulse w-3/4" />
                        <div className="h-3 bg-gray-800 rounded-md animate-pulse w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PlaylistSkeleton
