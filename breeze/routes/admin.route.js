'use strict';

var express = require('express'),
    route = express.Router(),
    User = require('./../models/User'),
    JS = require('./../libs'),
    statusCode = JS.Globals.http.statusCode,
    db = JS.Promises.db;

module.exports = route;
