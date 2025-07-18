import { Song } from "../models/song.model.js";

class SongController {
  static async getAllSongs(req, res) {
    try {
      const songs = await Song.find().sort({ createdAt: -1 });
      res.status(200).json(songs);
    } catch (error) {
      console.log("Error in getAllSongs", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getSongById(req, res) {
    try {
      const { id } = req.params;
      const song = await Song.findById(id);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }
      res.status(200).json(song);
    } catch (error) {
      console.log("Error in getSongById", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getFeaturedSongs(req, res) {
    try {
      const songs = await Song.aggregate([
        { $sample: { size: 6 } },
        {
          $project: {
            title: 1,
            artist: 1,
            audioUrl: 1,
            imageUrl: 1,
            duration: 1,
          },
        },
      ]);
      res.status(200).json(songs);
    } catch (error) {
      console.log("Error in getFeaturedSongs", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getMadeForYouSongs(req, res) {
    try {
      const songs = await Song.aggregate([
        { $sample: { size: 4 } },
        {
          $project: {
            title: 1,
            artist: 1,
            audioUrl: 1,
            imageUrl: 1,
            duration: 1,
          },
        },
      ]);
      res.status(200).json(songs);
    } catch (error) {
      console.log("Error in getMadeForYouSongs", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getTrendingSongs(req, res) {
    try {
      const songs = await Song.aggregate([
        { $sample: { size: 4 } },
        {
          $project: {
            title: 1,
            artist: 1,
            audioUrl: 1,
            imageUrl: 1,
            duration: 1,
          },
        },
      ]);
      res.status(200).json(songs);
    } catch (error) {
      console.log("Error in getTrendingSongs", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default SongController;
