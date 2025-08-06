import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import db from './db'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// CREATE - เพิ่ม todo ใหม่
app.post('/api/todos', async (req: Request, res: Response) => {
  const { title } = req.body
  console.log('POST /api/todos with title:', title)
  if (!title) return res.status(400).json({ error: 'Title is required' })
  try {
    const result = await db.query(
      'INSERT INTO todos (title) VALUES ($1) RETURNING *',
      [title]
    )
    console.log('Inserted todo:', result.rows[0])
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error inserting todo:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// READ - ดึงรายการ todo ทั้งหมด
app.get('/api/todos', async (_req: Request, res: Response) => {
  console.log('GET /api/todos')
  try {
    const result = await db.query('SELECT * FROM todos ORDER BY created_at DESC')
    console.log('Fetched todos:', result.rows.length, 'items')
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching todos:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// UPDATE - แก้ไข todo (title หรือ completed)
app.put('/api/todos/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  const { title, completed } = req.body
  console.log(`PUT /api/todos/${id} with data:`, { title, completed })
  try {
    const check = await db.query('SELECT * FROM todos WHERE id = $1', [id])
    if (check.rows.length === 0) {
      console.log('Todo not found with id:', id)
      return res.status(404).json({ error: 'Todo not found' })
    }

    const updated = await db.query(
      'UPDATE todos SET title = COALESCE($1, title), completed = COALESCE($2, completed) WHERE id = $3 RETURNING *',
      [title, completed, id]
    )
    console.log('Updated todo:', updated.rows[0])
    res.json(updated.rows[0])
  } catch (error) {
    console.error('Error updating todo:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE - ลบ todo ตาม id
app.delete('/api/todos/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  console.log('DELETE /api/todos/' + id)
  try {
    const deleted = await db.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id])
    console.log('Deleted rows:', deleted.rows)
    if (deleted.rows.length === 0) return res.status(404).json({ error: 'Todo not found' })
    res.json({ message: 'Todo deleted' })
  } catch (error) {
    console.error('Error deleting todo:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`)
})
