const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');
const bcrypt = require('bcryptjs');
const axios = require('axios');


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'default';

    next();
});


router.route('/')
    .get(defaultController.index);

router.route('/about')
    .get(defaultController.about);


router.route('/sign-up')
    .get(defaultController.signup)
    .post(defaultController.register);

router.route('/activate')
    .get(defaultController.activate);

router.route('/check-email')
    .get(defaultController.checkMail);

// router.post('/check-mail', async (req, res) => {
//     const { email } = req.query;
//     console.log(email)
  
//     try {
//       const response = await axios.post('http://localhost:9090/check-mail', {
//         email: email,
//       });
//       console.log('route is done')
  
//       if (response.status === 200) {
//         res.status(200).json({ message: '' });
//       } else {
//         res.status(400).json({ error: 'This email already exists' });
//       }
//     } catch (error) {
//       res.status(500).json({ error: 'Did not resolve.' });
//     }
//   });
  

// router.get('/check-mail', async (req, res) => {
//     const { email } = req.body;
//     console.log('route is the problem')
  
//     try {
//       const response = await axios.post('http://localhost:9090/check-mail', {
//         email
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       console.log('route is done')
  
//       if (response.status === 200) {
//         res.status(200).json({ message: 'ok' });
//       } else if (response.status === 400) {
//         res.status(400).json({ message: 'email exists' });
//       } else {
//         res.status(500).json({ error: response.data });
//       }
//     } catch (error) {
//       res.status(500).json({ error: 'Did not resolve.' });
//     }
//   });
  




router.route('/complete')
    .get(defaultController.complete);

router.route('/confirm')
    .get(defaultController.confirm);

router.route('/404')
    .get(defaultController.four);

router.route('/invalid')
    .get(defaultController.invalid);



router.get('/sitemap.xml', (req, res) => {
    res.sendFile('/views/default/sitemap.xml', {root: "."})
})





module.exports = router;
    