const express = require('express');
const router = express.Router();
const Parse = require('parse/node');


Parse.initialize('YPl3VWSConitZEtkKdHYxj02IQlWfFXfe4UQxBL0', 'qER0wQ8jBmBqngDJVn8BN2arY4xVzKnPc5TfGdIF');
Parse.serverURL = 'https://parseapi.back4app.com/';



router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Parse.User.logIn(username, password);
    const userData = {
      username: user.get('username'),
      profilePhoto: user.get('profilePhoto') ? user.get('profilePhoto').url() : null,
      sessionToken: user.getSessionToken()
    };
    res.status(200).json({ message: 'Login successful', user: userData });
  } catch (error) {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});



router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = new Parse.User();
    user.set('username', username);
    user.set('password', password);
    user.set('email', email);
    await user.signUp();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.post('/requestPasswordReset', async (req, res) => {
  try {
    const { email } = req.body;


    if (!email) {
      throw new Error('You must provide an email');
    }


    await Parse.User.requestPasswordReset(email);


    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {

    res.status(400).json({ error: error.message });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Parse.User.logIn(username, password);
    const userData = {
      username: user.get('username'),
      sessionToken: user.getSessionToken()
    };
    res.status(200).json({ message: 'Login successful', user: userData });
  } catch (error) {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});


router.post('/logout', async (req, res) => {
  try {

    localStorage.removeItem('sessionToken');
    localStorage.removeItem('username');


    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.use((req, res, next) => {
  const sessionToken = req.headers['x-parse-session-token'];
  console.log('Received session token:', sessionToken);
  if (!sessionToken) {
    return res.status(401).json({ error: 'Session token required' });
  }
  req.sessionToken = sessionToken;
  next();
});


router.get('/profile', async (req, res) => {
  try {
    const user = await Parse.User.me(req.sessionToken);

    if (user) {
      const userData = {
        username: user.get('username'),
        email: user.get('email'),
      };
      res.status(200).json(userData);
    } else {
      res.status(401).json({ error: 'Invalid session token' });
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;