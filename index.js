import express from "express";
import bodyParser from "body-parser";
import dayjs from "dayjs";
import session from "express-session";
import pool from "./db.js";
const app = express();
const port = 3000;

const ADMIN_USERNAME = "Pritika Giri";
const ADMIN_PASSWORD = "PritikaAdmin";
const today = dayjs().format("YYYY-MM-DD || dddd");

app.set("view cache", false);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: "yourSecretKey",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: null }
}));


app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});


app.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT 4"
    );
    res.render("index.ejs", {
      posts: result.rows,
      today,
      loginClicked: false,
      invalid: false
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).send("Error fetching posts");
  }
});


app.get("/login", (req, res) => {
  if (req.session.isAuthenticated) return res.redirect("/admin");
  res.render("index.ejs", {
    posts: [],
    today,
    loginClicked: true,
    invalid: false
  });
});

// Authentication middleware
function authentication(req, res, next) {
  if (req.body.username === ADMIN_USERNAME && req.body.password === ADMIN_PASSWORD) {
    req.session.isAuthenticated = true;
    req.session.username = req.body.username;
    return next();
  }

  res.render("index.ejs", {
    posts: [],
    today,
    loginClicked: true,
    invalid: true
  });
}


app.post("/login", authentication, (req, res) => {
  res.redirect("/admin");
});


app.get("/admin", async (req, res) => {
  if (!req.session.isAuthenticated) return res.redirect("/");
  try {
    const result = await pool.query(
      "SELECT * FROM blog_posts WHERE author = $1 ORDER BY created_at DESC",
      [req.session.username]
    );
    res.render("adminDashboard.ejs", {
      username: req.session.username,
      posts: result.rows
    });
  } catch (err) {
    console.error("Error loading admin posts:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/create", (req, res) => {
  if (!req.session.isAuthenticated) return res.redirect("/");
  res.render("createPost.ejs");
});


app.post("/postDetails", async (req, res) => {
  if (!req.session.isAuthenticated) return res.redirect("/");
  const { title, content, email } = req.body;
  try {
    await pool.query(
      `INSERT INTO blog_posts (author, title, content, email, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [req.session.username, title, content, email]
    );
    res.redirect("/admin");
  } catch (err) {
    console.error("Error inserting post:", err);
    res.status(500).send("Error saving post");
  }
});


app.get("/edit/:id", async (req, res) => {
  if (!req.session.isAuthenticated) return res.redirect("/");
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM blog_posts WHERE id = $1", [id]);
    const post = result.rows[0];
    if (!post || post.author !== req.session.username) return res.status(403).send("Forbidden");
    res.render("editPost.ejs", { post });
  } catch (err) {
    console.error("Error loading post for edit:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/edit/:id", async (req, res) => {
  if (!req.session.isAuthenticated) return res.redirect("/");
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const check = await pool.query("SELECT author FROM blog_posts WHERE id = $1", [id]);
    if (!check.rows[0] || check.rows[0].author !== req.session.username)
      return res.status(403).send("Forbidden");
    await pool.query(
      "UPDATE blog_posts SET title = $1, content = $2 WHERE id = $3",
      [title, content, id]
    );
    res.redirect("/admin");
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).send("Internal Server Error");
  }
});


app.post("/delete/:id", async (req, res) => {
  if (!req.session.isAuthenticated) return res.redirect("/");
  const { id } = req.params;
  try {
    const check = await pool.query("SELECT author FROM blog_posts WHERE id = $1", [id]);
    if (!check.rows[0] || check.rows[0].author !== req.session.username)
      return res.status(403).send("Forbidden");
    await pool.query("DELETE FROM blog_posts WHERE id = $1", [id]);
    res.redirect("/admin");
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/displayPost/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM blog_posts WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).send("Post not found");
    res.render("displayPost.ejs", { post: result.rows[0] });
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).send("Error retrieving post");
  }
});


app.get("/about", (req, res) => res.render("about.ejs"));

app.listen(port, () => console.log(`Listening on port ${port}`));
