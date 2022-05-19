const express = require("express");
const app = express();
const bodyParser = require("body-parser");
let jwt = require("jsonwebtoken");
const config = require("./config/index");

let getNonUser = (user) => {
    return {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role
    }
}

global.config = {
    secretKey: config.ACCESS_TOKEN,
}

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({
        msg: 'Auth service'
    });
});

app.get('/auth', (req, res) => {
    res.json({
        msg: 'Auth service'
    });
});

app.post('/verify-token', (req, res) => {
    var token = req.body.token;
    if (token) {
        jwt.verify(token, global.config.secretKey, (err, decoded) => {
            if (err) {
                return res.json({
                    p: 0,
                    msg: 'invalid token'
                });
            }else {
                return res.json({
                    p: 1,
                    msg: 'success token',
                    data: decoded
                });
            }
        });
    } else {
        res.json({
            p: 0,
            msg: 'No token provided'
        });
    }
});

app.post('/sign-token', (req, res) => {
    user = req.body;

    time = 1440;

    var token = jwt.sign(getNonUser(user), global.config.secretKey, {
        expiresIn: time // expires in 24 hours
    });
    res.json({
        p: 1,
        msg: "token success",
        token: token,
        time: time
    })
});

module.exports = app;