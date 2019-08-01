const express = require('express');
const User = require('../models/user_model.js')
const router = express.Router();

module.exports = router;

router.use((req, res, next) => {
    console.log('Data logger...');
    next()
})

router.post('/', (req, res, next) => {
    let userData = {
        username: req.body.username,
        password: req.body.password
    }
    User.getUserByUsernameRegister(userData)
        .then(result => {
            if (result) {
                res.json({ status: 200, message: 'Username already exist' })
            }
            else {
                next();
            }
        })
        .catch(err => {
            res.json({ status: 500, error: err });
        })
}, function (req, res) {
    let userData = {
        username: req.body.username,
        password: req.body.password
    }
    User.addNewUser(userData)
    .then(uid=>{
        User.generateJWT(uid).then(token=>{
            res.json({ token: token });
        })
        .catch(err=>{
            res.json({ status: 500, error: err });
        })
    })
    .catch(err=>{
        res.json({ status: 500, error: err });
    })
})