import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Pause, Play } from "lucide-react";
import type { Song } from "@/types";

const PlayButton = ({ song }: { song: Song }) => {
	const {
		currentSong,
		isPlaying,
		setCurrentSong,
		togglePlay,
		queue,
		initializeQueue,
	} = usePlayerStore();

	const isCurrentSong = currentSong?.id === song.id;

	const handlePlay = () => {
		if (isCurrentSong) {
			togglePlay();
		} else {
			const isSongInQueue = queue.some((s) => s.id === song.id);

			if (!isSongInQueue) {
				initializeQueue([song]);
			}

			if (!isCurrentSong) {
				setCurrentSong(song);
			}
		}
	};

	return (
		<Button
			size="icon"
			onClick={handlePlay}
			className={`absolute bottom-3 right-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all 
				opacity-0 translate-y-2 group-hover:translate-y-0 ${
				isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
			}`}
		>
			{isCurrentSong && isPlaying ? (
				<Pause className="size-5 text-black" />
			) : (
				<Play className="size-5 text-black" />
			)}
		</Button>
	);
};

export default PlayButton;
