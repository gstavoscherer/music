import {Router} from "express";
import { getAllAlbuns, getAlbumById } from "../controller/album.controller.js";

const router =  Router();

router.get('/', getAllAlbuns);
router.get('/:id', getAlbumById);


export default router