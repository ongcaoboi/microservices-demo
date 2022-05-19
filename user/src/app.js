const express = require("express");
const User = require("./models/users_model");
const app = express();
const bodyParser = require("body-parser");
const md5 = require("crypto-js/md5");

app.use(bodyParser.json());

let getNonUser = (user) => {
    return {
        name: user.name.firstName + ' ' + user.name.lastName,
        email: user.email,
        password: user.password,
        role: user.role
    }
}

async function authenToken(req, res, next) {
    var token = req.headers['access-token'];
    if (token) {
        const url = "http://auth:3000/verify-token";
        const data = {
            token: token
        }
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response = await fetch(url, options)
        var data_fetch = await response.json();
        if(data_fetch.p == 0){
            res.json({
                p: 0,
                msg: data_fetch.msg
            })
        }
        if(data_fetch.p == 1){
            req.user = data_fetch.data;
            next();
        }
    } else {
        res.json({
            p: 0,
            msg: 'No token provided.'
        });
    }
}

app.get("/", (req, res) => {
    res.json({
        msg: "User service"
    });
});

app.get("/user", (req, res) => {
    res.json({
        msg: "User service"
    });
});

app.get("/api/users", authenToken, async (req, res) => {
    console.log(req.user);
    const users = await User.find({});
    var users_clone = [];
    users.forEach(element => {
        users_clone.push({
            id: element._id,
            firstName: element.name.firstName,
            lastName: element.name.lastName,
            email: element.email,
            role: element.role,
            createdAt: element.createdAt
        })
    });
    res.json(users_clone);
});

app.post("/register", async (req, res) => {
    const user = User({
        name: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        },
        email: req.body.email,
        password: md5(req.body.password)
    });
    await user.save((err, user) => {
        if (err) {
            return res.status(400).send({
                p: 0,
                msg: "Can not create account!"
            });
        } else {
            user.password = undefined;
            let name = user.name.firstName + ' ' + user.name.lastName;
            return res.status(200).json({
                p: 1,
                msg: `Account ${name} is created. Please login by email`
            });
        }
    })
});

app.post("/login", async (req, res) => {
    User.findOne({
        email: req.body.email
    }, async (err, user) => {
        if (err) {
            return res.json({
                p: 0,
                msg: "Login failed."
            });
        }
        if (user) {
            if (user.password != md5(req.body.password)) {
                res.json({
                    p: 0,
                    msg: 'Authentication failed. Wrong password.'
                })
            } else {
                const url = "http://auth:3000/sign-token";
                const data = getNonUser(user);
                const options = {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                const response = await fetch(url, options);
                var data_fetch = await response.json();
                res.cookie('access_token', data_fetch.token, {
                    maxAge: 365 * 24 * 60 * 60 * 100,
                    httpOnly: true
                });
                res.json({
                    p: 1,
                    msg: 'authentication done ',
                    token: data_fetch.token
                });
            }
        } else {
            res.json({
                p: 0,
                msg: 'Can not find account',
            });
        }
    });

});

module.exports = app;