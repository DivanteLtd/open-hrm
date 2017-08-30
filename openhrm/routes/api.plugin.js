'use strict';

var express = require('express'),
    config = require('./../config'),
    crypto  = require('crypto'),
    JS = require('./../libs'),
    statusCode = JS.Globals.http.statusCode,
    route = express.Router();

var today = new Date(),
    now = today.getDate() + (today.getMonth() + 1) + today.getFullYear(),
    token = now + config.token + now,
    md5Token = crypto.createHash('md5').update(token).digest('hex');

route.get('/token', (req, res) => {
    res.statusCode = statusCode.ok;
    res.json({
        'token': md5Token
    });
});

route.post('/email', (req, res) => {
    if(req.body.token !== md5Token) {
        res.statusCode = statusCode.unAuth;
        res.send();
        return;
    }

    var email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if(!email.test(req.body.email)) {
        res.statusCode = 400;
        res.send();
        return;
    }

    res.statusCode = statusCode.accepted;
    res.send();
});

route.post('/profiles', (req, res) => {
    if(req.body.token !== md5Token) {
        res.statusCode = statusCode.unAuth;
        res.send();
        return;
    }

    res.statusCode = statusCode.accepted;
    res.send();
});


module.exports = route;
