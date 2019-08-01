const bcrypt = require('bcryptjs');
const uuidv1 = require('uuid/v1');
const jwt = require('jsonwebtoken');

let userdata = [
    {
        username: 'sett',
        password: '$2a$08$u8upvM/P/bfzMzdQ2JHbCOdl3nzrWCOocqfhF/wOkjJAzMglgXTqq',
        uid: '71007000b3d911e9af211f09f25ccfd0'
    }
];
let secret = 'my_secret';

module.exports = {
    getUserByUsernameRegister: getUserByUsernameRegister,
    getUserByUsernameLogin: getUserByUsernameLogin,
    addNewUser: addNewUser,
    generateJWT: generateJWT,
    comparePassword: comparePassword,
    verifyToken: verifyToken
}

function getUserByUsernameRegister(user) {
    return new Promise((resolve, reject) => {
        const result = userdata.find(data => data.username === user.username);
        if (result) {
            resolve(true);
        }
        else {
            resolve(false);
        }
    })
}

function getUserByUsernameLogin(user) {
    return new Promise((resolve, reject) => {
        const result = userdata.find(data => data.username === user.username);
        if (result) {
            let password = result.password;
            let uid = result.uid;
            comparePassword(user.password, password)
                .then(isMatch => {
                    if (isMatch) {
                        resolve({ status: true, uid: uid });
                    }
                    else {
                        resolve({ status: false });
                    }
                })
                .catch(err => {
                    reject({ messageError: 'Compare password error!', error: err })
                })
        }
        else {
            resolve(false);
        }
    })
}

function addNewUser(newUser) {
    return new Promise((resolve, reject) => {
        try {
            bcrypt.genSalt(8, function (err, salt) {
                if (err) reject({ messageError: 'Gen salt error!', error: err });
                bcrypt.hash(newUser.password, salt, function (err, hash) {
                    if (err) reject({ messageError: 'Gen hash error!', error: err });
                    newUser.password = hash;
                    newUser['uid'] = uuidv1().replace(/-/g, '');
                    userdata.push(newUser);
                    resolve(newUser.uid);
                });
            });
        } catch (error) {
            reject({ messageError: 'Add new user error!', error: error })
        }
    })
}

function generateJWT(uid) {
    return new Promise((resolve, reject) => {
        try {
            var token = jwt.sign({ uid: uid }, secret);
            resolve(token);
        } catch (error) {
            reject({ messageError: 'Gen JWT error!', error: error })
        }
    })
}

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        try {
            var decoded = jwt.verify(token, secret);
            resolve(decoded);
        } catch (err) {
            reject({ messageError: 'Verify token error!', error: err });
        }
    })
}

function comparePassword(candidatePassword, hashPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, hashPassword)
            .then(isMatch => {
                resolve(isMatch);
            })
            .catch(err => {
                reject({ messageError: 'Compare password error!', error: err })
            })
    })
}
