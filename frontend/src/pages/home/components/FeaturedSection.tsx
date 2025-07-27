"use client"

import type { Song } from "@/types"
import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton"
import { useMusicStore } from "@/stores/useMusicStore"
import SongCardWithExpandableMenu from "@/components/song-card-with-expandable-menu"

const FeaturedSection = () => {
	const { isLoading, featuredSongs, error } = useMusicStore()
	if (isLoading) return <FeaturedGridSkeleton />

	const IMAGE_URL = import.meta.env.VITE_API_BASE_URL

	if (error) return <p className="text-red-500 mb-4 text-lg">{error}</p>

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
			{featuredSongs.map((song: Song) => (
				<SongCardWithExpandableMenu
					key={song.id}
					song={{ ...song, image_url: `${IMAGE_URL}${song.image_url}` }}
				/>
			))}
		</div>
	)
}

export default FeaturedSection
