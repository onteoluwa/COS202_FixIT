import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// ─── Database Setup ───────────────────────────────────────────────
const db = new Database(path.join(__dirname, 'fixit.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    surname TEXT NOT NULL,
    middle_name TEXT DEFAULT '',
    date_of_birth TEXT NOT NULL,
    home_address TEXT NOT NULL,
    registration_date TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    order_date TEXT NOT NULL,
    menu_item TEXT NOT NULL,
    instructions TEXT DEFAULT '',
    payment_method TEXT NOT NULL,
    next_reservation TEXT DEFAULT '',
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );
`);

// ─── Customer Endpoints ───────────────────────────────────────────

// GET /customers/ — get all clients
app.get('/customers/', (req, res) => {
  const customers = db.prepare('SELECT * FROM customers').all();
  res.json(customers);
});

// POST /customers/ — register a new client
app.post('/customers/', (req, res) => {
  const { first_name, surname, middle_name = '', date_of_birth, home_address, registration_date } = req.body;

  if (!first_name || !surname || !date_of_birth || !home_address || !registration_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const stmt = db.prepare(`
    INSERT INTO customers (first_name, surname, middle_name, date_of_birth, home_address, registration_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(first_name, surname, middle_name, date_of_birth, home_address, registration_date);
  res.status(201).json({ id: result.lastInsertRowid, ...req.body });
});

// PUT /customers/:id — update a client
app.put('/customers/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, surname, middle_name = '', date_of_birth, home_address, registration_date } = req.body;

  const exists = db.prepare('SELECT id FROM customers WHERE id = ?').get(id);
  if (!exists) return res.status(404).json({ error: 'Client not found' });

  db.prepare(`
    UPDATE customers SET first_name=?, surname=?, middle_name=?, date_of_birth=?, home_address=?, registration_date=?
    WHERE id=?
  `).run(first_name, surname, middle_name, date_of_birth, home_address, registration_date, id);

  res.json({ id: Number(id), ...req.body });
});

// DELETE /customers/:id — delete a client and their repairs
app.delete('/customers/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM orders WHERE customer_id = ?').run(id);
  db.prepare('DELETE FROM customers WHERE id = ?').run(id);
  res.json({ message: 'Client deleted' });
});

// ─── Orders (Repairs) Endpoints ───────────────────────────────────

// GET /orders/:customerId — get all repairs for a client
app.get('/orders/:customerId', (req, res) => {
  const { customerId } = req.params;
  const orders = db.prepare('SELECT * FROM orders WHERE customer_id = ?').all(customerId);
  res.json(orders);
});

// POST /orders/:customerId — add a repair for a client
app.post('/orders/:customerId', (req, res) => {
  const { customerId } = req.params;
  const { order_date, menu_item, instructions = '', payment_method, next_reservation = '' } = req.body;

  const customer = db.prepare('SELECT id FROM customers WHERE id = ?').get(customerId);
  if (!customer) return res.status(404).json({ error: 'Client not found' });

  const result = db.prepare(`
    INSERT INTO orders (customer_id, order_date, menu_item, instructions, payment_method, next_reservation)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(customerId, order_date, menu_item, instructions, payment_method, next_reservation);

  res.status(201).json({ id: result.lastInsertRowid, customer_id: Number(customerId), ...req.body });
});

// PUT /orders/:id — update a repair
app.put('/orders/:id', (req, res) => {
  const { id } = req.params;
  const { order_date, menu_item, instructions = '', payment_method, next_reservation = '' } = req.body;

  const exists = db.prepare('SELECT id FROM orders WHERE id = ?').get(id);
  if (!exists) return res.status(404).json({ error: 'Repair not found' });

  db.prepare(`
    UPDATE orders SET order_date=?, menu_item=?, instructions=?, payment_method=?, next_reservation=?
    WHERE id=?
  `).run(order_date, menu_item, instructions, payment_method, next_reservation, id);

  res.json({ id: Number(id), ...req.body });
});

// DELETE /orders/:id — delete a repair
app.delete('/orders/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM orders WHERE id = ?').run(id);
  res.json({ message: 'Repair deleted' });
});

// ─── Start Server ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ FixIt backend running at http://localhost:${PORT}`);
});
