'use strict';

var Position = require('../models/Position');
var express = require('express');
var route = express.Router(),
    JS = require('./../libs'),
    statusCode = JS.Globals.http.statusCode,
    db = JS.Promises.db;

/**
 * add new position
 *
 * @request post
 * @url position/
 */
route.post('/', (req, res) => {
    if(!JS.Middleware.isAdmin(req)) {
        res.statusCode = statusCode.forbidden;
        res.send();
    }

    let position = new Position();

    position.name = req.body.name;

    db.save(position)
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
 * edit position
 *
 * @request put
 * @url position/:id
 */
route.put('/:id', (req, res) => {

    if(!JS.Middleware.isAdmin(req)) {
        res.statusCode = statusCode.forbidden;
        res.send();
    }

    var positionId = req.params.id,
        params = req.body,
        where = [];

    where.push({'_id': positionId});

    db.select(Position, where)
        .then((doc) => {
            if(!doc) {
                res.statusCode = statusCode.notfound;
                res.send();
            } else {
                return doc;
            }
        })
        .then((doc) => {
            if(doc) {
                for (let key in params) {
                    doc[0][key] = params[key];
                }
                return db.save(doc[0]);
            }
        })
        .then((doc) => {
            if(doc) {
                res.statusCode = statusCode.created;
                res.json({
                    'positionId': doc._id
                });
            }
        })
        .catch(() => {
            res.statusCode = statusCode.notfound;
            res.send();
        });
});

/**
 * get all position
 *
 * @request get
 * @url position/
 */
route.get('/', (req, res) => {
        db.select(Position)
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
 * get position
 *
 * @request get
 * @url position/:id
 */
route.get('/:id', (req, res) => {
    let positionId = req.params.id,
        where = [];

    where.push({'_id': positionId});

    db.select(Position, where)
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
 * delete position
 *
 * @request delete
 * @url position/:id
 */
route.delete('/:id', (req, res) => {

    if(!JS.Middleware.isAdmin(req)) {
        res.statusCode = statusCode.forbidden;
        res.send();
    }

    let positionId = req.params.id;

    db.remove(Position, { _id: positionId })
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
