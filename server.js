
const express = require('express');
const bodyParser = require('body-parser');

const sign_in = require('./user_authen/sign_in.js');
const sign_up = require('./user_authen/sign_up.js ');

const app = express();
const port = process.env.port || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/sign_in',sign_in);
app.use('/sign_up',sign_up);

app.listen(port, () => {
    console.log(`Server listen at port ${port}`);
})