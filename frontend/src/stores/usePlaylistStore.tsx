import { create } from "zustand"
import { axiosInstance } from "@/lib/axios"
import type { Playlist, Song } from "@/types"

interface PlaylistStore {
    playlists: Playlist[]
    isLoading: boolean
    currentPlaylist: Playlist | null
    error: string | null

    fetchPlaylists: () => Promise<void>
    fetchPlaylistById: (id: number) => Promise<void>
    createPlaylist: (name: string, song?: Song) => void
    setCurrentPlaylist: (playlist: Playlist | null) => void
    addPlaylist: (playlist: Playlist) => void

    addSongToPlaylist: (playlistId: number, song: Song) => Promise<void>
    removeSongFromPlaylist: (playlistId: number, songId: number) => void
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
    playlists: [],
    isLoading: false,
    currentPlaylist: null,
    error: null,

    fetchPlaylists: async () => {
        set({ isLoading: true, error: null })
        try {
            const response = await axiosInstance.get("/playlists")
            set({ playlists: response.data })
        } catch (error: unknown) {
            if (error instanceof Error) {
                set({ error: error.message })
            } else {
                set({ error: "Unknown error" })
            }
        } finally {
            set({ isLoading: false })
        }
    },

    fetchPlaylistById: async (id: number) => {
        set({ isLoading: true, error: null })
        try {
            const response = await axiosInstance.get<Playlist>(`/playlists/${id}`)
            set({ currentPlaylist: response.data })
        } catch (error: unknown) {
            if (error instanceof Error) {
                set({ error: error.message })
            } else {
                set({ error: "Erro ao buscar playlist" })
            }
        } finally {
            set({ isLoading: false })
        }
    },

    createPlaylist: async (name: string, song?: Song) => {
        set({ isLoading: true, error: null });

        try {
            const token = localStorage.getItem("token"); // ou useStore().token

            const payload = {
                name,
                song_id: song?.id,
            };

            const response = await axiosInstance.post<Playlist>(
                "/playlists",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            set((state) => ({
                playlists: [...state.playlists, response.data],
            }));
        } catch (error: unknown) {
            if (error instanceof Error) {
                set({ error: error.message });
            } else {
                set({ error: "Erro ao criar playlist" });
            }
        } finally {
            set({ isLoading: false });
        }
    },



    addPlaylist: (playlist: Playlist) => {
        set((state) => ({
            playlists: [...state.playlists, playlist],
        }))
    },

    setCurrentPlaylist: (playlist: Playlist | null) => {
        set({ currentPlaylist: playlist })
    },

    addSongToPlaylist: async (playlistId: number, song: Song) => {
        try {
            await axiosInstance.get("/songs/add-to-playlist", {
                params: {
                    playlist_id: playlistId,
                    song_id: song.id,
                },
            })

            set((state) => ({
                playlists: state.playlists.map((playlist) => {
                    if (playlist.id === playlistId) {
                        const songExists = playlist.songs.some((s) => s.id === song.id)
                        if (songExists) return playlist

                        return {
                            ...playlist,
                            songs: [...playlist.songs, song],
                            song_count: playlist.song_count + 1,
                        }
                    }
                    return playlist
                }),
            }))
        } catch (error) {
            console.error("Erro ao adicionar música à playlist:", error)
        }
    },

    removeSongFromPlaylist: (playlistId: number, songId: number) => {
        set((state) => ({
            playlists: state.playlists.map((playlist) => {
                if (playlist.id === playlistId) {
                    const updatedSongs = playlist.songs.filter((song) => song.id !== songId)
                    return {
                        ...playlist,
                        songs: updatedSongs,
                        song_count: updatedSongs.length,
                    }
                }
                return playlist
            }),
        }))
    },
}))
