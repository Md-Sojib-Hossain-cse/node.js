import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { Pool } from "pg";

const app: Application = express();
const port = 5000;

//middleware

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

//db connection
const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_C8lnFOf2aRMz@ep-holy-sea-aqvzna1c-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const initDB = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(20),
        email VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(20) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        age INT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);

    console.log("DB Connected Successfully!");
  } catch (error) {
    console.log(error);
  }
};

initDB();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello world!",
  });
});

app.post("/api/users", async (req: Request, res: Response) => {
  try {
    const { name, email, password, age } = req.body;

    const result = await pool.query(
      `
    INSERT INTO users(name,email,password,age) 
    VALUES($1,$2,$3,$4)
    RETURNING *
    `,
      [name, email, password, age],
    );

    console.log(result);

    res.status(201).json({
      message: "created!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Error",
      data: error,
    });
  }
});

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users
      `);

    console.log(result);

    res.status(200).json({
      message: "created!",
      data: result.rows || [],
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Error",
      data: error,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
