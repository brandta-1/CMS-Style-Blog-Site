const router = require('express').Router();
const { User } = require('../../M');

router.post('/', async (req, res) => {
  try {
    console.log(req.body)
    const userData = await User.create(req.body);
    console.log(userData);
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.statusMessage = "Check email format and password length (8 characters minimum)";
    res.status(400).end();
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    const validPassword = await userData.checkPassword(req.body.password);

    if (!userData || !validPassword) {
      res.statusMessage = "Invalid Credentials";
      res.status(400).end();
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.statusMessage = "Invalid Credentials";
    res.status(400).end();
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;