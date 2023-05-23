const PORT = process.env.PORT ?? 8000
const express = require('express')
const {v4: uuidv4} = require('uuid')
const cors = require('cors')
const app = express()
const pool = require('./db')

app.use(cors())

// get all todos
app.get('/todos/:userEmail', async (req, res) => {
    const { userEmail } = req.params
    const id = uuidv4()
    try {
        const todos = await pool.query('SELECT * FROM todos WHERE user_email = $1', [userEmail])
        res.json(todos.rows)
    } catch (err) {
        console.error(err)
    }
})

// create new todo
app.post('./todos', (req, res) => {
    const { user_email, title, progress, date} = req.body
    console.log(user_email, title, progress, date)
    try {
        pool.query(`INSERT INTO todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4. $5)`,
        [id, user_email, title, progress, date])
    } catch (err) {
        console.error(err)
    }
})

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))