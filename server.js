const express = require('express');
// Import and require Pool (node-postgres)
// We'll be creating a Connection Pool. Read up on the benefits here: https://node-postgres.com/features/pooling
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const pool = new Pool(
  {
    // Enter PostgreSQL username
    user: 'timothyscallon',
    // Enter PostgreSQL password
    password: '',
    host: 'localhost',
    database: 'movies_db'
},
console.log('Connected to the movies_db database!')
)

pool.connect();


app.get('/api/movies', (req, res) => {
  pool.query('SELECT * FROM movies', (err, {rows, rowCount}) => {
    console.log(rows)
    res.json(rows)
  })
})

app.post("/api/movies", (req, res) => {
  pool.query(`INSERT INTO movies(title) VALUES($1)`, [req.body.name], (err, resp) => {
    console.log(resp)
    res.json({ status: "ok" })
  })
})


app.delete('/api/movies/:id', (req, res) => {
  pool.query('DELETE FROM movies WHERE id = $1', [req.params.id], (err, resp) => {
    console.log(resp)
    res.json({ status: "ok" })
  })
})

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});