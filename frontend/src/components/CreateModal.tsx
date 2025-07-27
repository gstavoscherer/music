"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Folder, Music } from "lucide-react"
import {usePlaylistStore} from "@/stores/usePlaylistStore.tsx";

interface CreateModalProps {
    isOpen: boolean
    onClose: () => void
    type?: "playlist" | "folder" | null
}

export const CreateModal = ({ isOpen, onClose, type }: CreateModalProps) => {
    const [name, setName] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const { createPlaylist } = usePlaylistStore()

    const handleCreate = async () => {
        if (!name.trim()) return

        setIsCreating(true)
        try {
            if (type === "playlist") {
                await createPlaylist(name)
            } else if (type === "folder") {
                // Implementar criação de pasta aqui
                console.log("Creating folder:", name)
            }
            setName("")
            onClose()
        } catch (error) {
            console.error("Error creating:", error)
        } finally {
            setIsCreating(false)
        }
    }

    const handleClose = () => {
        setName("")
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-700">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        {type === "playlist" ? (
                            <>
                                <Music className="size-5" />
                                Criar Playlist
                            </>
                        ) : (
                            <>
                                <Folder className="size-5" />
                                Criar Pasta
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {type === "playlist"
                            ? "Crie uma nova playlist para organizar suas músicas"
                            : "Crie uma nova pasta para organizar suas playlists"}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-white">
                            Nome
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={type === "playlist" ? "Nome da playlist" : "Nome da pasta"}
                            className="bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-400"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && name.trim()) {
                                    handleCreate()
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={handleClose} className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={!name.trim() || isCreating}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {isCreating ? "Criando..." : "Criar"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

interface CreateMenuProps {
    children: React.ReactNode
    onCreatePlaylist: () => void
    onCreateFolder: () => void
}

export const CreateMenu = ({ children, onCreatePlaylist, onCreateFolder }: CreateMenuProps) => {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent className="bg-zinc-800 border-zinc-700">
                <ContextMenuItem onClick={onCreatePlaylist} className="text-white hover:bg-zinc-700 cursor-pointer">
                    <Music className="size-4 mr-2" />
                    Criar Playlist
                </ContextMenuItem>
                <ContextMenuItem onClick={onCreateFolder} className="text-white hover:bg-zinc-700 cursor-pointer">
                    <Folder className="size-4 mr-2" />
                    Criar Pasta
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
