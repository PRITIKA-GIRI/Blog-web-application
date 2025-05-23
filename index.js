import express from "express"
import bodyParser from "body-parser"
import dayjs from "dayjs";
import session from "express-session"
const app=express();
const port=3000;
const posts=[];
const username="Pritika Giri";
const password="PritikaAdmin";
let postId=0;
const day=dayjs().format('YYYY-MM-DD || dddd ');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: 'yourSecretKey', // Change this in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: null // Session expires when browser closes
  }
}));

app.get("/",(req,res)=>{
    
    res.render("index.ejs",{ posts: posts,today:day ,loginClicked:false,invalid:false});
})

app.get("/login",(req,res)=>{
    if(req.session.isAuthenticated){
        const author = req.session.username;
        const userPosts = posts.filter(post => post.authorName === author);
        res.render("adminDashboard.ejs", {
            posts: userPosts,
            username: author
        });
    }
    else
    res.render("index.ejs",{invalid:false,posts: posts,today:day,loginClicked:true})
//    res.render("loginform.ejs",{invalid:false}) ;
})
//middleware 
function authentication(req,res,next){
    
 if(username===req.body.username && password===req.body.password){
    req.session.isAuthenticated = true;
    req.session.username = req.body.username; 
    next();
 }
 else{
    res.render("index.ejs",{invalid:true,loginClicked:true,posts: posts,today:day})
 }
}

app.post("/login",authentication,(req,res)=>{
    const author = req.body.username;
   const userPosts = posts.filter(post => post.authorName === author);
  res.render("adminDashboard.ejs", {
    posts: userPosts,
    username: author
  });
})

app.get("/create",(req,res)=>{
    res.render("createPost.ejs");
})

app.get("/about",(req,res)=>{
    res.render("about.ejs");
})

app.post("/postDetails",(req,res)=>{
    const post={
        postId:postId++,
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