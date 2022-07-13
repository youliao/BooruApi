import Booru from "booru";
import Fetch from "node-fetch";
import * as Utils from "../utils.js";

export function getPost(site) {
  return async (req, res) => {
    const id = req.params.id;

    const results = await Booru.search(site, `id:${id}`, { limit: 1 });
    const rawData = results.first?.data;
    if (!rawData) return res.sendStatus(404);

    return res.json(rawData);
  };
}

export function getPosts(site) {
  return async (req, res) => {
    const start = req.query.start;
    const limit = req.query.limit;

    const results = await Booru.search(site, `id:>=${start} order:id`, {
      limit: limit,
    });
    const rawData = results.posts.map((x) => x.data);
    return res.json(rawData);
  };
}

export function getLatest(site) {
  return async (req, res) => {
    const limit = req.query.limit;
    const page = req.query.page;

    const results = await Booru.search(site, "order:change_desc", {
      limit: limit,
      page: page,
    });
    const rawData = results.posts.map((x) => x.data);
    return res.json(rawData);
  };
}

export function getPostFileLinkById(site) {
  return async (req, res) => {
    const id = req.params.id;

    const url = await Utils.getFileUrl(site, id);
    if (!url) return res.sendStatus(404);

    return res.redirect(url);
  };
}

export function getPostFileLinkByObjectKey(site) {
  return async (req, res) => {
    const objectKey = req.params.objectKey;

    try {
      const fileUrl = Utils.constructFileUrl(site, objectKey);
      return res.redirect(fileUrl);
    } catch (error) {
      return res.status(400).send(error);
    }
  };
}

export function getPostFileById(site) {
  return async (req, res) => {
    const id = req.params.id;

    const url = await Utils.getFileUrl(site, id);
    if (!url) return res.sendStatus(404);

    Fetch(url)
      .then((response) => {
        if (!response.ok) {
          res.sendStatus(response.status);
        }
        return response.body;
      })
      .then((body) => body.pipe(res))
      .catch((error) => {
        res.status(500).send("There has been a problem with fetch operation:", error);
      });
  };
}

export function getPostFileByObjectKey(site) {
  return async (req, res) => {
    const objectKey = req.params.objectKey;
    const url = Utils.constructFileUrl(site, objectKey);

    Fetch(url)
      .then((response) => {
        if (!response.ok) {
          res.sendStatus(response.status);
        }
        return response.body;
      })
      .then((body) => body.pipe(res))
      .catch((error) => {
        res.status(500).send("There has been a problem with fetch operation:", error);
      });
  };
}
