import Express from "express";
import handlers from "./handlers.js";
import "express-async-errors";

const site = "yandere";
const router = Express.Router();

router.get("/posts", handlers.getPosts(site));

router.get("/posts/latest", handlers.getLatest(site));

router.get("/posts/:id", handlers.getPost(site));

router.get("/postlinks/:id", handlers.getPostLink(site));

router.get("/postfiles/:id", handlers.getPostFile(site));

export default router;
