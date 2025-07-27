"use client"

import type { Song } from "@/types"
import SectionGridSkeleton from "./SectionGridSkeleton"
import SongCardWithExpandableMenu from "@/components/song-card-with-expandable-menu"
import { Button } from "@/components/ui/button"

type SectionGridProps = {
	title: string;
	songs: Song[];
	isLoading: boolean;
};

const SectionGrid = ({ songs, title, isLoading }: SectionGridProps) => {
	if (isLoading) return <SectionGridSkeleton />

	const IMAGE_URL = import.meta.env.VITE_API_BASE_URL

	return (
		<div className="mb-6">
			<div className="flex items-center justify-between mb-3">
				<h2 className="text-lg sm:text-xl font-semibold text-white">{title}</h2>
				<Button variant="link" className="text-xs text-zinc-400 hover:text-white">
					Show all
				</Button>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-8 gap-3">
				{songs.map((song: Song) => (
					<SongCardWithExpandableMenu
						key={song.id}
						song={{ ...song, image_url: `${IMAGE_URL}${song.image_url}` }}
					/>
				))}
			</div>
		</div>
	)
}

export default SectionGrid
