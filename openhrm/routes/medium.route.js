'use strict';

var Medium = require('../models/Medium');
var express = require('express');
var route = express.Router(),
    JS = require('./../libs'),
    statusCode = JS.Globals.http.statusCode,
    db = JS.Promises.db;

/**
 * add new medium
 *
 * @request post
 * @url medium/
 */
route.post('/', (req, res) => {
    if(!JS.Middleware.isAdmin(req)) {
        res.statusCode = statusCode.forbidden;
        res.send();
    }

    let medium = new Medium();

    medium.name = req.body.name;

    db.save(medium)
        .then((doc) => {
            res.statusCode = statusCode.created;
            res.json({
                'positionId': doc._id
            });
        })
        .catch(() => {
            res.statusCode = statusCode.bad;
            res.send();
        });
});

/**
 * get all medium
 *
 * @request get
 * @url medium/
 */

route.get('/', (req, res) => {
    db.select(Medium)
        .then((docs) => {

            res.statusCode = statusCode.ok;
            res.json(docs);
        })
        .catch(() => {
            res.statusCode = statusCode.bad;
            res.send();
        });
});

/**
 * get medium
 *
 * @request get
 * @url medium/:id
 */
route.get('/:id', (req, res) => {
    let mediumId = req.params.id,
        where = [];

    where.push({'_id': mediumId});

    db.select(Medium, where)
        .then((docs) => {
            res.statusCode = (docs) ? statusCode.ok : statusCode.notfound;
            res.json(docs);
        })
        .catch(() => {
            res.statusCode = statusCode.notfound;
            res.send();
        });
});

/**
 * delete medium
 *
 * @request delete
 * @url medium/:id
 */
route.delete('/:id', (req, res) => {

    if(!JS.Middleware.isAdmin(req)) {
        res.statusCode = statusCode.forbidden;
        res.send();
    }

    let mediumId = req.params.id;

    db.remove(Medium, { _id: mediumId })
        .then(() => {
            res.statusCode = statusCode.deleted;
            res.send();
        })
        .catch(() => {
            res.statusCode = statusCode.notfound;
            res.send();
        });
});

module.exports = route;
