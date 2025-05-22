import express from "express"
import bodyParser from "body-parser"
import dayjs from "dayjs";
const app=express();
const port=3000;
const posts=[];
const username="Pritika Giri";
const password="PritikaAdmin";
const day=dayjs().format('YYYY-MM-DD || dddd ');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    
    res.render("index.ejs",{ posts: posts,today:day ,loginClicked:false,invalid:false});
})

app.get("/login",(req,res)=>{
    res.render("index.ejs",{invalid:false,posts: posts,today:day,loginClicked:true})
//    res.render("loginform.ejs",{invalid:false}) ;
})
//middleware 
function authentication(req,res,next){
    
 if(username===req.body.username && password===req.body.password){
    next();
 }
 else{
    res.render("index.ejs",{invalid:true,loginClicked:true,posts: posts,today:day})
 }
}

app.post("/login",authentication,(req,res)=>{
    res.render("adminDashboard.ejs");
})

app.get("/create",(req,res)=>{
    res.render("createPost.ejs");
})

app.get("/about",(req,res)=>{
    res.render("about.ejs");
})

app.post("/postDetails",(req,res)=>{
    const post={
        authorName:req.body.author,
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