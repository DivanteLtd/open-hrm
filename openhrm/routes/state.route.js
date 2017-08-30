'use strict';

var express = require('express'),
    State = require('./../models/LeadState'),
    JS = require('./../libs'),
    statusCode = JS.Globals.http.statusCode,
    db = JS.Promises.db,
    route = express.Router();


/**
 * add new state
 *
 * @request post
 * @url state/
 */
route.post('/', (req, res) => {
    if(!JS.Middleware.isAdmin(req)) {
        res.statusCode = statusCode.forbidden;
        res.send();
    }

    let state = new State();

    state.name = req.body.name;
    state.code = req.body.code;

    db.save(state)
        .then((doc) => {
            res.statusCode = statusCode.created;
            res.json({
                'leadId': doc._id
            });
        })
        .catch(() => {
            res.statusCode = statusCode.bad;
            res.send();
        });
});

/**
 * edit state
 *
 * @request put
 * @url state/:id
 */
route.put('/:id', (req, res) => {

    if(!JS.Middleware.isAdmin(req)) {
        res.statusCode = statusCode.forbidden;
        res.send();
    }

    var stateId = req.params.id,
        params = req.body,
        where = [];

    where.push({'_id': stateId});

    db.select(State, where)
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
                    'leadId': doc._id
                });
            }
        })
        .catch(() => {
            res.statusCode = statusCode.notfound;
            res.send();
        });
});

/**
 * get all states
 *
 * @request get
 * @url state/
 */
route.get('/', (req, res) => {
    db.select(State)
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
 * get state
 *
 * @request get
 * @url state/:id
 */
route.get('/:id', (req, res) => {
    let stateId = req.params.id,
        where = [];

    where.push({'_id': stateId});

    db.select(State, where)
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
 * delete state
 *
 * @request delete
 * @url state/:id
 */
route.delete('/:id', (req, res) => {

    if(!JS.Middleware.isAdmin(req)) {
        res.statusCode = statusCode.forbidden;
        res.send();
    }

    let stateId = req.params.id;

    db.remove(State, { _id: stateId })
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
