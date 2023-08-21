const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');
const {signinLimiter} = require('../config/customFunction');


router.route('/register')
    .post(signinLimiter, defaultController.register);

router.route('/activate')
    .post(defaultController.activate);

router.route('/check-mail')
    .post( defaultController.checkMail);


    router.get('/mercy', (req, res) =>{
        res.status(200).json({message: 'The Lord has shown OSajie Omongbale mercy'})
    
    });



router.get('/sitemap.xml', (req, res) => {
    res.sendFile('/views/default/sitemap.xml', {root: "."})
})





module.exports = router;
    