
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = './autoservisas.db';

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({
  secret: 'slaptas_raktas',
  resave: false,
  saveUninitialized: true
}));

// DB
const db = new sqlite3.Database(DB_PATH);

// Titulinis
app.get('/', (req, res) => {
  res.render('index');
});

// Forma POST
app.post('/registracija', (req, res) => {
  const { vardas, el_pastas, telefonas, automobilis, paslauga, data } = req.body;
  db.run(`INSERT INTO uzrasymai (vardas, el_pastas, telefonas, automobilis, paslauga, data)
          VALUES (?, ?, ?, ?, ?, ?)`,
          [vardas, el_pastas, telefonas, automobilis, paslauga, data],
          function(err) {
            if (err) return res.send('Klaida registruojant');
            res.render('sekme');
          });
});

// Prisijungimo forma
app.get('/admin', (req, res) => {
  if (req.session.prisijunges) {
    db.all('SELECT * FROM uzrasymai ORDER BY registruota DESC', [], (err, rows) => {
      res.render('admin', { uzrasymai: rows });
    });
  } else {
    res.render('login');
  }
});

// Admin login
app.post('/admin', (req, res) => {
  const { slaptazodis } = req.body;
  if (slaptazodis === 'servisas2024!') {
    req.session.prisijunges = true;
    res.redirect('/admin');
  } else {
    res.send('Neteisingas slaptažodis');
  }
});

app.listen(PORT, () => {
  console.log(`Veikia http://localhost:${PORT}`);
});
