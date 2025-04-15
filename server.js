
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render('login'));
app.get('/admin', (req, res) => res.render('admin'));
app.get('/sekme', (req, res) => res.render('sekme'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
