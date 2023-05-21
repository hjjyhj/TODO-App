const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3001;

// For Users
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : process.env.MYSQL_SECRET,
  database : 'myDB'
});



db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/create-todos-table', (req, res) => {
  let sql = 'CREATE TABLE todos(id int AUTO_INCREMENT, title VARCHAR(255), status VARCHAR(255), PRIMARY KEY(id))';
  db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('Todos table created...');
  });
});

app.get('/todos', (req, res) => {
  let sql = 'SELECT * FROM todos';
  let query = db.query(sql, (err, results) => {
    if(err) throw err;
    res.json(results);
  });
});

// POST route for '/todos'
app.post('/todos', verifyToken, (req, res) => {
  const newTodo = {...req.body, user_id: req.userId};
  let sql = 'INSERT INTO todos SET ?';
  let query = db.query(sql, newTodo, (err, result) => {
    if(err) {
      console.log('Error inserting new todo:', err);
      res.status(500).send('Error inserting new todo');
      return;
    }
    res.json(result);
  });
});

app.put('/todos/:id', verifyToken, (req, res) => {
  let sql = 'SELECT * FROM todos WHERE id = ?';
  let query = db.query(sql, [req.params.id], (err, results) => {
    if(err) throw err;

    // Check if the todo belongs to the authenticated user
    if (results[0].user_id !== req.userId) {
      res.status(403).send('You are not authorized to update this todo');
      return;
    }

    // If the todo belongs to the authenticated user, perform the update operation
    sql = 'UPDATE todos SET ? WHERE id = ?';
    query = db.query(sql, [req.body, req.params.id], (err, result) => {
      if(err) throw err;
      res.json(result);
    });
  });
});

app.delete('/todos/:id', verifyToken, (req, res) => {
  let sql = 'SELECT * FROM todos WHERE id = ?';
  let query = db.query(sql, [req.params.id], (err, results) => {
    if(err) throw err;

    // Check if the todo belongs to the authenticated user
    if (results[0].user_id !== req.userId) {
      res.status(403).send('You are not authorized to delete this todo');
      return;
    }

    // If the todo belongs to the authenticated user, perform the delete operation
    sql = 'DELETE FROM todos WHERE id = ?';
    query = db.query(sql, req.params.id, (err, result) => {
      if(err) throw err;
      res.json(result);
    });
  });
});


app.get('/update-todos-table', (req, res) => {
  let sql = 'ALTER TABLE todos ADD user_id INT';
  db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('Todos table updated...');
  });
});

app.get('/todos', verifyToken, (req, res) => {
  let sql = 'SELECT * FROM todos WHERE user_id = ?';
  let query = db.query(sql, req.userId, (err, results) => {
    if(err) throw err;
    res.json(results);
  });
});

// DELETE route for '/todos/:id'
app.delete('/todos/:id', (req, res) => {
  console.log("Deleting Todo with id:", req.params.id); // Add this line
  let sql = 'DELETE FROM todos WHERE id = ?';
  let query = db.query(sql, req.params.id, (err, result) => {
    if(err) throw err;
    console.log("Deleted Todo result:", result); // Add this line
    res.json(result);
  });
});


// PUT route for '/todos/:id'
app.put('/todos/:id', (req, res) => {
  console.log("id:", req.params.id); // Add this line
  console.log("body:", req.body); // Add this line
  let sql = 'UPDATE todos SET ? WHERE id = ?';
  let query = db.query(sql, [req.body, req.params.id], (err, result) => {
    if(err) throw err;
    res.json(result);
  });
});

app.post('/register', function (req, res) {
  db.query('SELECT * FROM users WHERE username = ?', [req.body.username], (err, results) => {
    if (err) throw err;
    
    if (results.length > 0) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }
    
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      
      db.query('INSERT INTO users SET ?', {username: req.body.username, password: hash}, (err, result) => {
        if (err) throw err;
        res.json({ message: 'User created' });
      });
    });
  });
});

app.post('/login', function (req, res) {
  db.query('SELECT * FROM users WHERE username = ?', [req.body.username], (err, results) => {
    if (err) throw err;
    
    if (results.length == 0) {
      res.status(400).json({ error: 'User not found' });
      return;
    }
    
    bcrypt.compare(req.body.password, results[0].password, function (err, result) {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      
      if (result) {
        var token = jwt.sign(
          { username: results[0].username, id: results[0].id },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        
        res.json({ message: 'Authentication successful', token: token });
      } else {
        res.status(401).json({ error: 'Password incorrect' });
      }
    });
  });
});

function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) return res.status(500).json({ error: 'Failed to authenticate token' });
    
    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
};

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
