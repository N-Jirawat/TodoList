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
  if (!title) return res.status(400).json({ error: 'Title is required' })
  try {
    const result = await db.query(
      'INSERT INTO todos (title) VALUES ($1) RETURNING *',
      [title]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// READ - ดึงรายการ todo ทั้งหมด
app.get('/api/todos', async (_req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM todos ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// UPDATE - แก้ไข todo (title หรือ completed)
app.put('/api/todos/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  const { title, completed } = req.body
  try {
    const check = await db.query('SELECT * FROM todos WHERE id = $1', [id])
    if (check.rows.length === 0) return res.status(404).json({ error: 'Todo not found' })

    const updated = await db.query(
      'UPDATE todos SET title = COALESCE($1, title), completed = COALESCE($2, completed) WHERE id = $3 RETURNING *',
      [title, completed, id]
    )
    res.json(updated.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE - ลบ todo ตาม id
app.delete('/api/todos/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  try {
    const deleted = await db.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id])
    if (deleted.rows.length === 0) return res.status(404).json({ error: 'Todo not found' })
    res.json({ message: 'Todo deleted' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`)
})
