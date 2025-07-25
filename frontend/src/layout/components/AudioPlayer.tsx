import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
	const AUDIO_URL = import.meta.env.VITE_API_BASE_URL;
	const audioRef = useRef<HTMLAudioElement>(null);
	const prevSongRef = useRef<string | null>(null);
	const pendingPlayRef = useRef(false);

	const { currentSong, isPlaying, playNext } = usePlayerStore();

	useEffect(() => {
		if (!audioRef.current || !currentSong) return;

		const audio = audioRef.current;
		const isSongChange = prevSongRef.current !== currentSong.audio_url;

		if (isSongChange) {
			console.log("🔁 Mudando música para:", currentSong.audio_url);
			audio.src = currentSong.audio_url!;
			audio.currentTime = 0;
			prevSongRef.current = String(currentSong.audio_url);

			const handleCanPlay = () => {
				console.log("✅ Audio pronto para tocar");
				if (isPlaying) {
					audio.play().catch((err) => {
						console.warn("⚠️ Play falhou (canplay):", err);
					});
				}
				audio.removeEventListener("canplay", handleCanPlay);
			};

			audio.addEventListener("canplay", handleCanPlay);
		}
	}, [currentSong, isPlaying]);


	// Avança para a próxima música quando a atual termina
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleEnded = () => {
			console.log("⏭️ Música terminou. Tocando próxima.");
			playNext();
		};

		audio.addEventListener("ended", handleEnded);
		return () => audio.removeEventListener("ended", handleEnded);
	}, [playNext]);

	// Atualiza o src do áudio e só toca depois que estiver carregado
	useEffect(() => {
		if (!audioRef.current || !currentSong) return;

		const audio = audioRef.current;
		const fullAudioUrl = `${AUDIO_URL}${currentSong.audio_url}`;

		const isNewSong = prevSongRef.current !== fullAudioUrl;
		if (!isNewSong) return;

		console.log("🔁 Mudando música para:", fullAudioUrl);
		audio.src = fullAudioUrl;
		audio.currentTime = 0;
		prevSongRef.current = fullAudioUrl;
		pendingPlayRef.current = true;

		const handleCanPlay = () => {
			pendingPlayRef.current = false;

			if (isPlaying) {
				console.log("✅ Áudio pronto. Tocando agora.");
				audio.play().catch((err) => {
					console.error("🚫 Play falhou (canplaythrough):", err);
				});
			}

			audio.removeEventListener("canplaythrough", handleCanPlay);
		};

		audio.addEventListener("canplaythrough", handleCanPlay);
	}, [currentSong, isPlaying, AUDIO_URL]);

	return <audio ref={audioRef} />;
};

export default AudioPlayer;
