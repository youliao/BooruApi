import Express from "express";
import * as handlers from "./handlers.js";
import "express-async-errors";

const site = "konac";
const router = Express.Router();

router.get("/posts", handlers.getPosts(site));

router.get("/posts/latest", handlers.getLatest(site));

router.get("/posts/:id", handlers.getPost(site));

router.get("/postfileurls/:id", handlers.getPostFileUrlById(site));

router.get("/postfileurls", handlers.getPostFileUrlByObjectKey(site));

router.get("/postfiles/:id", handlers.getPostFileById(site));

router.get("/postfiles", handlers.getPostFileByObjectKey(site));

export default router;
