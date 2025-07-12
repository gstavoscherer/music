import { Song } from '../models/song.model.js';

export const getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find().sort({ createdAt: -1 });
        res.status(200).json(songs);
    } catch (error) {
        console.log("Error in getAllSongs", error);
        res.status(500).json({message: "Internal server error"});
    }
}
export const getSongById = async (req, res) => {
    try {
        const { id } = req.params;
        const song = await Song.findById(id);
        if (!song) {
            return res.status(404).json({message: "Song not found"});
        }
        res.status(200).json(song);
    } catch (error) {
        console.log("Error in getSongById", error);
        res.status(500).json({message: "Internal server error"});
    }
}
export const getFeaturedSongs = async (req, res) => {
    try {
        const songs = await Song.aggregate([{
            $sample: { size: 6 } 
        },
        {
            $project: {
                title: 1,
                artist: 1,
                audioUrl: 1,
                imageUrl: 1,
                duration: 1
            }
        }
    ]);
        res.status(200).json(songs);
    } catch (error) {
        console.log("Error in getFeaturedSongs", error);
        res.status(500).json({message: "Internal server error"});
    }
}
export const getMadeForYouSongs = async (req, res) => {
     try {
        const songs = await Song.aggregate([{
            $sample: { size: 4 } 
        },
        {
            $project: {
                title: 1,
                artist: 1,
                audioUrl: 1,
                imageUrl: 1,
                duration: 1
            }
        }
    ]);
        res.status(200).json(songs);
    } catch (error) {
        console.log("Error in getFeaturedSongs", error);
        res.status(500).json({message: "Internal server error"});
    }
}
export const getTrendingSongs = async (req, res) => {
    try {
        const songs = await Song.aggregate([{
            $sample: { size: 6 } 
        },
        {
            $project: {
                title: 1,
                artist: 1,
                audioUrl: 1,
                imageUrl: 1,
                duration: 1
            }
        }
    ]);
        res.status(200).json(songs);
    } catch (error) {
        console.log("Error in getTrendingSongs", error);
        res.status(500).json({message: "Internal server error"});
    }
}