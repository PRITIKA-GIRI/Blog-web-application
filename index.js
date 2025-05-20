import express from "express"
import bodyParser from "body-parser"

const app=express();
const port=3000;
const posts=[];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("index.ejs",{ posts: posts });
})
app.get("/create",(req,res)=>{
    res.render("createPost.ejs");
})
app.get("/about",(req,res)=>{
    res.render("about.ejs");
})
app.post("/postDetails",(req,res)=>{
    const post={
        title:req.body.title,
        content:req.body.content,
        emails:req.body.email
        // photo:req.body.fileInput
    }
    posts.push(post);
  res.redirect('/');
})
app.post("/create",(req,res)=>{
    res.render("createPost.ejs");
})

app.listen(port,()=>{
    console.log(`Listening at port ${port}.`)
})