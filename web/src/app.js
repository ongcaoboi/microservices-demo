const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.static('../public'));
app.use(express.json());
app.set('view engine', 'ejs');

const checkLogin = async (req, res, next) => {
    var token = req.cookies.access_token;
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
        try {
            req.user = undefined;
            const response = await fetch(url, options);
            var data_fetch = await response.json();
            if (data_fetch.p == 1) {
                req.user = data_fetch.data;
            }
            next();
        } catch (err) {
            req.user = undefined;
            next();
        }
    } else {
        req.user = undefined;
        next();
    }
}

app.get('/', checkLogin, (req, res) => res.render('home', { data: req.user }));

app.get('/logout', checkLogin, (req, res) => {
    if (req.user) {
        res.cookie('access_token', 'undefined', { maxAge: 1 });
        res.redirect('/');
    } else {
        res.render('error', {
            data: {
                code: "404",
                title: "Oops! This Page Could Not Be Found",
                content: `Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily
                unavailable`
            }
        });
    }
});

app.get('/login', checkLogin, (req, res) => {
    if (req.user) {
        res.redirect('/');
    } else {
        res.render('login', { data: req.user })
    }
});

app.get('/signup', checkLogin, (req, res) => {
    if (req.user) {
        res.redirect('/');
    } else {
        res.render('signup', { data: req.user })
    }
});

app.get('/smoothies', checkLogin, (req, res) => {
    if (req.user) {
        res.render('smoothies', { data: req.user })
    } else {
        res.redirect('/login');
    }
});

module.exports = app;