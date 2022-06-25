import Express from 'express';
import yandere from "./routes/yandere.js";
import danbooru from "./routes/danbooru.js";
import konachan from "./routes/konachan.js";

const app = Express();
const port = 3000;

app.use("/boorus/yandere",yandere);
app.use("/boorus/danbooru",danbooru);
app.use("/boorus/konachan",konachan);

app.listen(port,()=>{
    console.log(`at http://localhost:${port}`);
})
