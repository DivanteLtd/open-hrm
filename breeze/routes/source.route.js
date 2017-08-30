'use strict';

var Source = require('../models/Source');
var express = require('express');
var route = express.Router(),
    JS = require('./../libs'),
    statusCode = JS.Globals.http.statusCode,
    db = JS.Promises.db;

/**
 * add new source
 *
 * @request post
 * @url source/
 */
route.post('/', (req, res) => {
    if(!JS.Middleware.isAdmin(req)) {
        res.statusCode = statusCode.forbidden;
        res.send();
    }

    let source = new Source();

    source.name = req.body.name;

    db.save(source)
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
 * edit source
 *
 * @request put
 * @url source/:id
 */
route.put('/:id', (req, res) => {

    if(!JS.Middleware.isAdmin(req)) {
        res.statusCode = statusCode.forbidden;
        res.send();
    }

    var sourceId = req.params.id,
        params = req.body,
        where = [];

    where.push({'_id': sourceId});

    db.select(Source, where)
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
 * get all source
 *
 * @request get
 * @url source/
 */
route.get('/', (req, res) => {

        db.select(Source, 'desc')
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
 * get source
 *
 * @request get
 * @url source/:id
 */
route.get('/:id', (req, res) => {
    let sourceId = req.params.id,
        where = [];

    where.push({'_id': sourceId});

    db.select(Source, where)
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

    db.remove(Source, { _id: positionId })
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
