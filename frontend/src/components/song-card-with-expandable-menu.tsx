import type React from "react"
import { useState } from "react"
import ExpandableContextMenu from "./expandable-context-menu"
import type { Song } from "@/types"
import { usePlaylistStore } from "@/stores/usePlaylistStore"
import PlayButton from "@/pages/home/components/PlayButton"

interface SongCardWithExpandableMenuProps {
    song: Song
}

const SongCardWithExpandableMenu = ({ song }: SongCardWithExpandableMenuProps) => {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; show: boolean }>({
        x: 0,
        y: 0,
        show: false,
    })

    const { playlists, addSongToPlaylist, createPlaylist } = usePlaylistStore()

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            show: true,
        })
    }

    const handleCloseContextMenu = () => {
        setContextMenu({ x: 0, y: 0, show: false })
    }

    const handleAddToPlaylist = (playlistId: number, song: Song) => {
        addSongToPlaylist(playlistId, song)
        console.log(`Song "${song.title}" added to playlist!`)
    }

    const handleCreatePlaylist = (name: string, song: Song) => {
        createPlaylist(name, song)
        console.log(`Playlist "${name}" created with song "${song.title}"!`)
    }

    const handleRemoveFromLiked = (song: Song) => {
        console.log(`Removed "${song.title}" from liked songs`)
    }

    return (
        <>
            <div
                className="group relative bg-zinc-800 p-2 rounded-md hover:bg-zinc-700 transition-all cursor-pointer"
                onContextMenu={handleContextMenu}
            >
                <div className="relative aspect-square mb-2">
                    <img
                        src={song.image_url}
                        alt={song.title}
                        className="w-full h-full object-cover rounded-sm"
                    />
                    <PlayButton song={song} />
                </div>

                <div className="space-y-0.5">
                    <h3 className="text-sm font-medium text-white truncate">{song.title}</h3>
                    <p className="text-xs text-zinc-400 truncate">{song.artist.name}</p>
                </div>
            </div>


            {contextMenu.show && (
                <ExpandableContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    song={song}
                    playlists={playlists}
                    onClose={handleCloseContextMenu}
                    onAddToPlaylist={handleAddToPlaylist}
                    onCreatePlaylist={handleCreatePlaylist}
                    onRemoveFromLiked={handleRemoveFromLiked}
                />
            )}
        </>
    )
}

export default SongCardWithExpandableMenu
