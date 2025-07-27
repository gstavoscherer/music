export interface Song {
	id: number;
	title: string;
	artist: Artist;
	album: Album | null;
	image_url: string;
	audio_url?: string;
	duration: number;
	genre?: string;
	release_year?: number;
	created_at?: string;
	updated_at?: string;
}
export interface Album {
	id: number;
	title: string;
	artist: Artist;
	image_url?: string;
	release_year?: number;
	genre?: string;
	songs: Song[];
	created_at?: string;
	updated_at?: string;
}
export interface Artist {
	id: number;
	name: string;
	created_at?: string;
	updated_at?: string;
}
export interface User {
	id: number;
	username?: string;
	email?: string;
	password?: string;
	full_name: string;
	image_url?: string;
	created_at?: string;
	updated_at?: string;
}

export interface Message {
	id: number;
	sender_id: User;
	receiver_id: User;
	content: string;
	created_at?: string;
	updated_at?: string;
}
export interface Like {
	id: number;
	user: User;
	song: Song;
	created_at?: string;
	updated_at?: string;
}
export interface Playlist {
	id: number;
	name: string;
	description?: string;
	image_url?: string;
	user_id?: number;
	created_at?: string;
	updated_at?: string;
	song_count: number;
	songs: Song[];
}
export interface PlaylistSong {
	id: number;
	playlist: Playlist;
	song: Song;
	created_at?: string;
	updated_at?: string;
}
export interface SongArtist {
	id: number;
	song: Song;
	artist: Artist;
	created_at?: string;
	updated_at?: string;
}
export interface Activity {
	id: number;
	song: Song;
	user: User;
	playedAt?: string;
	created_at?: string;
	updated_at?: string;
}


export interface Stats {
	total_songs: number;
	total_albums: number;
	total_users: number;
	total_artists: number;
}
