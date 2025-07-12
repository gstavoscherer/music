import { Song } from "../models/song.model.js";
import {Album} from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js"

const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto",
        })
        return result.secure_url
    } catch (error) {
        console.log("Error in uploadCloudinary", error)
        throw new Error(error)
    }
}

export const createSong = async (req, res) =>{
    try {
        if(!req.files || !req.files.audioFile || !req.files.imageFile){
            return res.status(400).json({message: "Please upload all files"});
        }

        const {title, artist, albumId, duration} = req.body;
        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;

        const audioUrl = await uploadToCloudinary(audioFile);
        const imageUrl = await uploadToCloudinary(imageFile);

        const song = new Song({
            title, artist, audioUrl, imageUrl, duration, 
            albumId: albumId || null
        });

        await song.save()

        if(albumId){
            await Album.findByIdAndUpdate(albumId, 
                {
                    $push:{songs:song._id},
                }
            )
        }
        res.status(201).json(song);
    } catch (error) {
        console.log("Error in createSong", error);
        res.status(500).json("Internal server error");
        
    }
}

export const deleteSong = async (req, res) => {
    try {
        const {id} = req.params;
        const song = await Song.findById(id);
        if(!song){
            return res.status(404).json({message: "Song not found"});
        }   
        await Song.findByIdAndDelete(id);
        if(song.albumId){
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: {songs: id}
            });
        }
        res.status(200).json({message: "Song deleted successfully"});
    } catch (error) {
        console.log("Error in deleteSong", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const createAlbum = async (req, res, next) => {
    try {
        const {title, artis, releaseYear} = req.body;
        const imageFile = req.files

        if(!imageFile || !imageFile.imageUrl){
            return res.status(400).json({message: "Please upload an image"});
        }

        const imageUrl = await uploadToCloudinary(imageFile.imageUrl);

        const album = new Album({
            title, artist, imageUrl, releaseYear
        });

        await album.save();

        res.status(201).json(album);
    } catch (error) {
        console.log("Error in createAlbum", error);
        res.status(500).json({message: "Internal server error"});
    }
}
export const deleteAlbum = async (req, res) => {
    try {
        const {id} = req.params;
        const album = await Album.findById(id);
        if(!album){ 
            return res.status(404).json({message: "Album not found"});
        }
        await Album.findByIdAndDelete(id);
        await Song.deleteMany({albumId: id});
        res.status(200).json({message: "Album deleted successfully"});
    } catch (error) {
        console.log("Error in deleteAlbum", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const checkAdmin = (req, res) => {
    res.status(200).json({admin: true});
}