const express = require('express');
const path = require('path');
const app = express();
const port = 9001;

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('home', { title: 'Hey', message: 'Hello there!' });
    //res.send('Hello World');
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'Hey', message: 'Hello there!' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Hey', message: 'Hello there!' });
});

app.get('/register', (req, res) => {
    res.render('register', { title: 'Hey', message: 'Hello there!' });
});

app.listen(port, () => {
    console.log('Server listening at http://localhost:'+port);
});