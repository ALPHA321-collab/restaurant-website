git initconst express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'change-me';
const DATA = path.join(__dirname, 'data');

app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const read = (file, fallback) => {
  try { return JSON.parse(fs.readFileSync(path.join(DATA, file), 'utf8')); }
  catch { return fallback; }
};
const write = (file, data) => fs.mkdirSync(DATA, { recursive: true }) ||
 
  fs.writeFileSync(path.join(DATA, file), JSON.stringify(data, null, 2));

const clean = (v, max = 200) => String(v ?? '').trim().slice(0, max);

// Public: menu
app.get('/api/menu', (req, res) => res.json(read('menu.json', [])));

// Public: book a table
app.post('/api/reservations', (req, res) => {
  const r = {
    id: Date.now(),
    name: clean(req.body.name, 80),
    phone: clean(req.body.phone, 30),
    date: clean(req.body.date, 10),
    time: clean(req.body.time, 5),
    guests: Number(req.body.guests),
    note: clean(req.body.note, 300),
    createdAt: new Date().toISOString()
  };
  const errors = [];
  if (r.name.length < 2) errors.push('Enter your name.');
  if (!/^[0-9+\-\s]{7,20}$/.test(r.phone)) errors.push('Enter a valid phone number.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(r.date) || r.date < new Date().toISOString().slice(0, 10))
    errors.push('Choose a date that is today or later.');
  if (!/^\d{2}:\d{2}$/.test(r.time)) errors.push('Choose a time.');
  if (!(r.guests >= 1 && r.guests <= 20)) errors.push('Guests must be between 1 and 20.');
  if (errors.length) return res.status(400).json({ errors });

  const all = read('reservations.json', []);
  all.push(r);
  write('reservations.json', all);
  res.status(201).json({ message: `Table booked for ${r.guests} on ${r.date} at ${r.time}.` });
});

// Public: contact message
app.post('/api/contact', (req, res) => {
  const m = {
    id: Date.now(),
    name: clean(req.body.name, 80),
    email: clean(req.body.email, 120),
    message: clean(req.body.message, 1000),
    createdAt: new Date().toISOString()
  };
  if (m.name.length < 2 || !/^\S+@\S+\.\S+$/.test(m.email) || m.message.length < 5)
    return res.status(400).json({ errors: ['Fill in your name, a valid email and a message.'] });
  const all = read('messages.json', []);
  all.push(m);
  write('messages.json', all);
  res.status(201).json({ message: 'Message sent. We will reply soon.' });
});

// Admin: list bookings and messages (send header x-admin-key)
const admin = (req, res, next) =>
  req.get('x-admin-key') === ADMIN_KEY ? next() : res.status(401).json({ errors: ['Unauthorized.'] });
app.get('/api/admin/reservations', admin, (req, res) => res.json(read('reservations.json', [])));
app.get('/api/admin/messages', admin, (req, res) => res.json(read('messages.json', [])));

app.listen(PORT, () => console.log(`Angithi running at http://localhost:${3000}`));
