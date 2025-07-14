import { Album } from "../models/album.model.js";

export const getAllAlbuns = async (req, res, next) => {
    try {
        const albuns = await Album.find().populate('songs');
        res.status(200).json(albuns);
    } catch (error) {
        console.log("Error in getAllAlbuns", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getAlbumById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const album = await Album.findById(id).populate('songs');
        if(!album){
            return res.status(404).json({message: "Album not found"});
        }
        res.status(200).json(album);
    } catch (error) {
        console.log("Error in getAlbumById", error);
        res.status(500).json({message: "Internal server error"});
    }
}