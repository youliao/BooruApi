import Booru from "booru";
import LRU from "lru-cache";

const options = {
  max: 5000,
  ttl: 1000 * 60 * 60,
};

const cache = new LRU(options);

export function constructFileUrl(site, objectKey) {
  if (!objectKey) throw "Object key can't be null!";

  const domain = Booru.forSite(site).domain;
  const [md5] = objectKey.split(".");

  switch (domain) {
    case "yande.re":
      return `https://files.yande.re/image/${objectKey}`;
    case "danbooru.donmai.us":
      return `https://cdn.donmai.us/original/${md5.substr(0, 2)}/${md5.substr(2, 2)}/${objectKey}`;
    case "konachan.com":
      return `https://konachan.com/image/${objectKey}`;
    case "gelbooru.com":
      return `https://img3.gelbooru.com/images/${md5.substr(0, 2)}/${md5.substr(2, 2)}/${objectKey}`;
    default:
      throw `Not supported for ${domain}`;
  }
}

export async function getFileUrl(site, id) {
  const key = `${site}:${id}`;
  if (cache.has(key)) return cache.peek(key);

  const results = await Booru.search(site, `id:${id}`, { limit: 1 });
  setFileUrlCache(site, id, 100);
  return results.first?.fileUrl;
}

function setFileUrlCache(site, start, limit) {
  Booru.search(site, `id:>=${start} order:id`, { limit: limit }).then((posts) => {
    if (posts.length === 0) return;

    const urlsMap = new Map();
    posts.forEach((post) => {
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
