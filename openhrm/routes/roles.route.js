'use strict';

var express = require('express'),
    route = express.Router(),
    config = require('./../config');

/**
 * get all roles of users
 *
 * @request get
 * @url roles/
 */

route.get('/', (req, res) => {
    res.json(config.user.role);
});


module.exports = route;
