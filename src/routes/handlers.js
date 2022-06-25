import Booru from "booru";
import Fetch from 'node-fetch';

const handlers = {
    getPost :(site)=>{
        return async (req,res) =>{
            const id = req.params.id;

            const results = await Booru.search(site,`id:${id}`, { limit: 1});
            const rawData = results.first?.data;
            if(!rawData) return res.sendStatus(404);
        
            return res.json(rawData);
        };
    },
    getPosts :(site)=>{
        return async (req,res) =>{
            const start = req.query.start;
            const limit = req.query.limit;
        
            const results = await Booru.search(site,`id:>=${start} order:id`, { limityar: limit});
            const rawData = results.posts.map(x=>x.data);
            return res.json(rawData);
        };
    },
    getLatest :(site)=>{
        return async (req,res) =>{
            const limit = req.query.limit;
            const page = req.query.page;
            
            const results = await Booru.search(site,"order:change_desc", { limit: limit,page:page});
            const rawData = results.posts.map(x=>x.data);
            return res.json(rawData);
        };
    },    
    getPostLink :(site)=>{
        return async (req,res) =>{
            const id = req.params.id;

            const results = await Booru.search(site,`id:${id}`, { limit: 1});
            const url = results.first?.fileUrl;
            if(!url) return res.sendStatus(404);
        
            return res.redirect(url);
        };
    },
    getPostFile :(site)=>{
        return async (req,res) =>{
            const id = req.params.id;

            const results = await Booru.search(site,`id:${id}`, { limit: 1});
            const fileUrl = results.first?.fileUrl;
            if(!fileUrl) return res.sendStatus(404);
        
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

export default handlers;