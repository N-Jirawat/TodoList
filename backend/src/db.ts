import dotenv from 'dotenv';
import path from 'path';
import { Pool } from 'pg';

// โหลด .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log("ENV:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ ใช้ String(...) เพื่อความชัวร์ว่าทุกค่าเป็น string
const pool = new Pool({
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT),
  user: String(process.env.DB_USER),
  password: String(process.env.DB_PASSWORD), // <<< ตรงนี้สำคัญ
  database: String(process.env.DB_NAME),
});

export default pool;
