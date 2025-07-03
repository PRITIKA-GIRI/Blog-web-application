
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",    
  host: "localhost",
  database: "blogposts",    
  password: "dbbdpostgres",
  port: 5432,
});

export default pool;
