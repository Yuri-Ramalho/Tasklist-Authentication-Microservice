const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const Parse = require('parse/node');

const usersRouter = require('./backend/routes/users');
const tasksRouter = require('./backend/routes/tasks');

const app = express();

app.use(cors());
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'frontend')));

Parse.initialize('YPl3VWSConitZEtkKdHYxj02IQlWfFXfe4UQxBL0', 'qER0wQ8jBmBqngDJVn8BN2arY4xVzKnPc5TfGdIF');
Parse.serverURL = 'https://parseapi.back4app.com/';




app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


app.use('/api/users', usersRouter);
app.use('/api/tasks', tasksRouter);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/html/landing-page.html'));
});

app.get('/landing-page.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/html/landing-page.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/html/dashboard.html'));
});

app.get('/task-list.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/html/task-list.html'));
});

app.get('/add-task.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/html/add-task.html'));
});

app.get('/edit-task.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/html/edit-task.html'));
});

app.get('/login-page.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/html/login-page.html'));
});

app.get('/password-reset.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/html/password-reset.html'));
});

app.get('/user-profile.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/html/user-profile.html'));
});

app.get('/user-registration.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/html/user-registration.html'));
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});