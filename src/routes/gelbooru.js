import Express from "express";
import * as handlers from "./handlers.js";
import "express-async-errors";

const site = "gelbooru";
const router = Express.Router();

router.get("/posts/:id(\\d+)", handlers.getPost(site));

router.get("/postfiles/:id(\\d+)", handlers.getPostFileById(site));

router.get("/postfiles/:objectKey([a-f0-9]{32}\.[a-z0-9]{2,4})", handlers.getPostFileByObjectKey(site));

router.get("/postfilelinks/:id(\\d+)", handlers.getPostFileLinkById(site));

router.get("/postfilelinks/:objectKey([a-f0-9]{32}\.[a-z0-9]{2,4})", handlers.getPostFileLinkByObjectKey(site));

export default router;
