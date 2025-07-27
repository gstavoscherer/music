"use client"

import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Library, Plus, ArrowRight, Search, List, Folder } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {CreateMenu, CreateModal} from "@/components/CreateModal.tsx";
import {usePlaylistStore} from "@/stores/usePlaylistStore.tsx";

const LeftSideBar = () => {
    const IMAGE_URL = import.meta.env.VITE_API_BASE_URL
    const { playlists, fetchPlaylists, isLoading } = usePlaylistStore()
    const [activeTab, setActiveTab] = useState("Playlists")
    const [isExpanded, setIsExpanded] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [createType, setCreateType] = useState<"playlist" | "folder" | null>(null)

    useEffect(() => {
        fetchPlaylists()
    }, [fetchPlaylists])

    const tabs = ["Playlists", "Artists", "Albums"]

    const getItemTypeDisplay = (item: any) => {
        const type = item.type || "Playlist"
        const creator = item.creator || item.artist || "Unknown"
        return `${type} • ${creator}`
    }

    const handleCreatePlaylist = () => {
        setCreateType("playlist")
        setModalOpen(true)
    }

    const handleCreateFolder = () => {
        setCreateType("folder")
        setModalOpen(true)
    }

    const handleCloseModal = () => {
        setModalOpen(false)
        setCreateType(null)
    }

    return (
        <div className="h-full flex flex-col gap-2">
            {/* Your Library Section */}
            <div className="flex-1 rounded-lg bg-zinc-900 p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-white px-2">
                        <Library className="mr-2 size-5" />
                        <span className="hidden md:inline font-semibold">Your Library</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                            onClick={handleCreatePlaylist}
                        >
                            <Plus className="size-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <ArrowRight className={cn("size-4 transition-transform", isExpanded && "rotate-90")} />
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                    {tabs.map((tab) => (
                        <Button
                            key={tab}
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "text-xs px-3 py-1 h-8 rounded-full",
                                activeTab === tab
                                    ? "bg-white text-black hover:bg-gray-200"
                                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
                            )}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </Button>
                    ))}
                </div>

                {/* Search and Filter */}
                <div className="flex items-center justify-between mb-4">
                    <Button variant="ghost" size="icon" className="size-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                        <Search className="size-4" />
                    </Button>
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <span className="hidden md:inline">Recents</span>
                        <Button variant="ghost" size="icon" className="size-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                            <List className="size-4" />
                        </Button>
                    </div>
                </div>

                {/* Content List with Context Menu */}
                <CreateMenu onCreatePlaylist={handleCreatePlaylist} onCreateFolder={handleCreateFolder}>
                    <ScrollArea className="h-[calc(100vh-400px)]">
                        <div className="space-y-1">

                            {isLoading ? (
                                <PlaylistSkeleton />
                            ) : (
                                playlists.map((playlist) => (
                                    <Link
                                        key={`playlist-${playlist.id ?? Math.random()}`}
                                        to={`/playlist/${playlist.id}`}
                                        className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                                    >
                                        <div className="relative size-12 rounded-md flex-shrink-0 overflow-hidden">
                                            <img
                                                src={playlist.image_url
                                                    ? `${IMAGE_URL}${playlist.image_url}`
                                                    : `${IMAGE_URL}/uploads/images/baseplaylist.png`}
                                                alt={playlist.name}
                                                className="size-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 hidden md:block">
                                            <p className="font-medium truncate text-white text-sm">{playlist.name}</p>
                                            <p className="text-zinc-400 text-xs truncate">{getItemTypeDisplay(playlist)}</p>
                                        </div>
                                    </Link>
                                ))
                            )}

                            {/* Example folder item */}
                            <div className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer">
                                <div className="size-12 rounded-md flex-shrink-0 bg-zinc-700 flex items-center justify-center">
                                    <Folder className="size-6 text-zinc-400" />
                                </div>
                                <div className="flex-1 min-w-0 hidden md:block">
                                    <p className="font-medium truncate text-white text-sm">My Folders</p>
                                    <p className="text-zinc-400 text-xs truncate flex items-center gap-1">
                                        <span className="text-green-500">📌</span>7 folders
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </CreateMenu>
            </div>

            {/* Modal de Criação */}
            <CreateModal isOpen={modalOpen} onClose={handleCloseModal} type={createType} />
        </div>
    )
}

export default LeftSideBar
