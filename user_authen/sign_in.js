const express = require('express');
const User = require('../models/user_model.js');

const router = express.Router();

module.exports = router;

router.use(function (req, res, next) {
    console.log('Data logger...');
    next()
})

router.post('/', function (req, res, next) {
    let userData = {
        username: req.body.username,
        password: req.body.password
    }
    User.getUserByUsernameLogin(userData)
        .then(users => {
            if (users.status) {
                req.uid = users.uid;
                next();
            }
            else {
                res.json({ status: 204, message: 'Username not found' });
            }
        })
        .catch(err => {
            res.json({ status: 500, error: err })
        })
}, function (req, res, next) {
    User.generateJWT(req.uid)
        .then(token => {
            res.json({ token: token })
        })
        .catch(err => {
            res.json({ status: 500, error: err })
        })
})

