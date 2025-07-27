"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import {
    Plus, Heart, ChevronRight, Search
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePlaylistStore } from "@/stores/usePlaylistStore"
import type { Song, Playlist } from "@/types"

interface ExpandableContextMenuProps {
    x: number
    y: number
    song: Song
    onClose: () => void
    playlists: Playlist[]
    onAddToPlaylist: (playlistId: number, song: Song) => void
    onCreatePlaylist: (name: string, song: Song) => void
    onRemoveFromLiked: (song: Song) => void
}

const ExpandableContextMenu = ({
                                   x,
                                   y,
                                   song,
                                   onClose,
                                   onAddToPlaylist,
                                   onCreatePlaylist,
                                   onRemoveFromLiked,
                               }: ExpandableContextMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null)
    const submenuRef = useRef<HTMLDivElement>(null)

    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
    const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 })
    const [searchTerm, setSearchTerm] = useState("")
    const [newPlaylistName, setNewPlaylistName] = useState("")
    const [showCreateForm, setShowCreateForm] = useState(false)

    const playlists = usePlaylistStore((state) => state.playlists)
    const fetchPlaylists = usePlaylistStore((state) => state.fetchPlaylists)

    const didFetchRef = useRef(false)
    const IMAGE_URL = import.meta.env.VITE_API_BASE_URL
    useEffect(() => {
        if (!didFetchRef.current) {
            fetchPlaylists()
            didFetchRef.current = true
        }
    }, [fetchPlaylists])
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                submenuRef.current &&
                !submenuRef.current.contains(event.target as Node)
            ) {
                onClose()
            }
        }
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                if (activeSubmenu) setActiveSubmenu(null)
                else onClose()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEscape)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [onClose, activeSubmenu])

    const filteredPlaylists = Array.isArray(playlists)
        ? playlists.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : []

    const handleCreatePlaylist = () => {
        if (newPlaylistName.trim()) {
            onCreatePlaylist(newPlaylistName.trim(), song)
            setNewPlaylistName("")
            setShowCreateForm(false)
            onClose()
        }
    }

    const handleSubmenuHover = (type: string, e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setSubmenuPosition({ x: rect.right + 5, y: rect.top })
        setActiveSubmenu(type)
    }

    return createPortal(
        <>
            {/* MAIN MENU */}
            <div
                ref={menuRef}
                className="fixed z-50 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg py-1 min-w-[220px]"
                style={{ left: x, top: y }}
            >
                <button
                    onClick={() => {}}
                    onMouseEnter={(e) => handleSubmenuHover("playlist", e)}
                    className="w-full px-3 py-2 text-left text-sm text-white hover:bg-zinc-700 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <Plus className="w-4 h-4" />
                        Add to playlist
                    </div>
                    <ChevronRight className="w-4 h-4" />
                </button>

                <button
                    onClick={() => {
                        onRemoveFromLiked(song)
                        onClose()
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-white hover:bg-zinc-700"
                >
                    <Heart className="inline-block mr-2 w-4 h-4" />
                    Remove from Liked
                </button>
            </div>

            {/* PLAYLIST SUBMENU */}
            {activeSubmenu === "playlist" && (
                <div
                    ref={submenuRef}
                    className="fixed z-50 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg py-2 w-80"
                    style={{ left: submenuPosition.x, top: submenuPosition.y }}
                    onMouseEnter={() => setActiveSubmenu("playlist")}
                    onMouseLeave={() => setActiveSubmenu(null)}
                >
                    <div className="px-3 pb-2 border-b border-zinc-700">
                        <div className="relative mb-2">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input
                                placeholder="Find a playlist"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 h-8 bg-zinc-700 border-zinc-600 text-white text-sm"
                            />
                        </div>

                        {!showCreateForm ? (
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="w-full flex items-center gap-2 px-2 py-1 text-sm text-white hover:bg-zinc-700 rounded"
                            >
                                <Plus className="w-4 h-4" />
                                New playlist
                            </button>
                        ) : (
                            <div className="space-y-2">
                                <Input
                                    placeholder="Playlist name"
                                    value={newPlaylistName}
                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                    className="h-8 bg-zinc-700 border-zinc-600 text-white text-sm"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleCreatePlaylist()
                                        else if (e.key === "Escape") {
                                            setShowCreateForm(false)
                                            setNewPlaylistName("")
                                        }
                                    }}
                                    autoFocus
                                />
                            </div>
                        )}
                    </div>

                    <ScrollArea className="h-64">
                        {filteredPlaylists.map((playlist) => (
                            <button
                                key={playlist.id}
                                onClick={() => {
                                    onAddToPlaylist(playlist.id, song)
                                    onClose()
                                }}
                                className="w-full p-2 text-left hover:bg-zinc-700 rounded flex items-center gap-3"
                            >
                                <div className="w-8 h-8 bg-zinc-600 rounded flex items-center justify-center flex-shrink-0">
                                    <img src={playlist.image_url
                                        ? `${IMAGE_URL}${playlist.image_url}`
                                        : `${IMAGE_URL}/uploads/images/baseplaylist.png`}/>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-white text-sm truncate">{playlist.name}</p>
                                    <p className="text-xs text-zinc-400">{playlist.song_count} songs</p>
                                </div>
                            </button>
                        ))}

                    </ScrollArea>
                </div>
            )}
        </>,
        document.body
    )
}

export default ExpandableContextMenu
