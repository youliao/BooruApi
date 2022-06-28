import Booru from "booru";
import Fetch from 'node-fetch';
import LRU from 'lru-cache';

const options = {
    max: 5000,
    ttl: 1000 * 60 * 60,
}

const cache = new LRU(options);

const handlers = {
    getPost: (site) => {
        return async (req, res) => {
            const id = req.params.id;

            const results = await Booru.search(site, `id:${id}`, { limit: 1 });
            const rawData = results.first?.data;
            if (!rawData) return res.sendStatus(404);

            return res.json(rawData);
        };
    },
    getPosts: (site) => {
        return async (req, res) => {
            const start = req.query.start;
            const limit = req.query.limit;

            const results = await Booru.search(site, `id:>=${start} order:id`, { limit: limit });
            const rawData = results.posts.map(x => x.data);
            return res.json(rawData);
        };
    },
    getLatest: (site) => {
        return async (req, res) => {
            const limit = req.query.limit;
            const page = req.query.page;

            const results = await Booru.search(site, "order:change_desc", { limit: limit, page: page });
            const rawData = results.posts.map(x => x.data);
            return res.json(rawData);
        };
    },
    getPostLink: (site) => {
        return async (req, res) => {
            const id = req.params.id;

            const url = await getFileUrl(site, id, cache);
            if (!url) return res.sendStatus(404);

            return res.json(url);
        };
    },
    getPostFile: (site) => {
        return async (req, res) => {
            const id = req.params.id;

            const results = await Booru.search(site, `id:${id}`, { limit: 1 });
            const fileUrl = results.first?.fileUrl;
            if (!fileUrl) return res.sendStatus(404);

            Fetch(fileUrl)
                .then(response => {
                    if (!response.ok) {
                        res.sendStatus(response.status);
                    }
                    return response.body;
                })
                .then(body => body.pipe(res))
                .catch(error => {
                    res.status(500).send('There has been a problem with fetch operation:', error);
                });
        };
    }
}

async function getFileUrl(site, id, cache) {
    const key = `${site}:${id}`;
    if (cache.has(key)) return cache.peek(key);

    const results = await Booru.search(site, `id:${id}`, { limit: 1 });
    setFileUrlCache(site, id, 100, cache);
    return results.first?.fileUrl;
}

function setFileUrlCache(site, start, limit, cache) {
    Booru.search(site, `id:>=${start} order:id`, { limit: limit })
        .then(posts => {
            if (posts.length === 0) return;

            const urlsMap = new Map();
            posts.forEach(post => {
                const key = `${site}:${post.id}`;
                urlsMap.set(key, post.fileUrl);
            });

            const end = parseInt(posts[posts.length - 1].id);

            for (let i = start; i <= end; i++) {
                const key = `${site}:${i}`;

                if (urlsMap.has(key)) cache.set(key, urlsMap.get(key));
                else cache.set(key, null);
            }
        });
}

export default handlers;