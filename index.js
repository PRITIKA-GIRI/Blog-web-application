import express from "express"
import bodyParser from "body-parser"

const app=express();
const port=3000;
const posts=[];
const username="Pritika Giri";
const password="PritikaAdmin";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("index.ejs",{ posts: posts });
})

app.get("/login",(req,res)=>{
    res.send(`
        <h2>Login Form</h2>
         <form method="POST" action="/login">
            <input type="text" name="username" placeholder="Username" required /><br/>
            <input type="password" name="password" placeholder="Password" required /><br/>
            <button type="submit">Login</button>
        </form>
        `)  
})
function authentication(req,res,next){
 if(username===req.body.username && password===req.body.password){
    next();
 }
 else{
    res.send("Invalid crendentials.")
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