**Node.js Blog Project**

This is a simple blog project built using Node.js and Express.js.

**Features:**

-Create and display blog posts
-Simple login for admin to view own posts
-View posts with titles, content, author, and email
-Session management for login state
-Basic routing with Express and EJS templating

**How to Run:**

-Make sure you have Node.js installed.
-Clone this repository.
-Run npm install to install dependencies.
-Run node index.js to start the server.
-Open your browser and go to http://localhost:3000

**Notes:**

-The project uses in-memory storage for posts (no database).
-Login credentials are hardcoded (username: Pritika Giri, password: PritikaAdmin).
-Session data is stored in memory and resets when the server restarts.
-No edit or delete functionality available yet.
-Static files like CSS and images are served from the public folder.

**Future Improvements:**

-Add database support (MongoDB, etc.)
-Implement edit and delete post features
-Secure authentication with hashed passwords
-Improve UI and add pagination
