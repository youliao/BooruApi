import Express from 'express';
import yandere from "./routes/yandere.js";
import danbooru from "./routes/danbooru.js";
import konachan from "./routes/konachan.js";
import gelbooru from "./routes/gelbooru.js";

const app = Express();
const port = 3000;

app.use("/api/boorus/yandere", yandere);
app.use("/api/boorus/danbooru", danbooru);
app.use("/api/boorus/konachan", konachan);
app.use("/api/boorus/gelbooru", gelbooru);

app.listen(port, () => {
    console.log(`at http://localhost:${port}`);
})
