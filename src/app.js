import Express from "express";
import yandere from "./routes/yandere.js";
import danbooru from "./routes/danbooru.js";
import konachan from "./routes/konachan.js";

const app = Express();
const port = 3000;

app.use("/api/boorus/yandere", yandere);
app.use("/api/boorus/danbooru", danbooru);
app.use("/api/boorus/konachan", konachan);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`at http://localhost:${port}`);
});
