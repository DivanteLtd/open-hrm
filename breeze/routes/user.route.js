'use strict';

var express = require('express'),
    route = express.Router(),
    User = require('./../models/User'),
    JS = require('./../libs'),
    statusCode = JS.Globals.http.statusCode,
    db = JS.Promises.db;

/**
 * edit user
 *
 * @request put
 * @url user/:id
 */
route.put('/', (req, res) => {
    var id = req.body._id;

    var userId = id,
        params = req.body,
        where = [];

    where.push({'_id': userId});
    db.select(User, where)
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
                    if(key === 'role') {
                        doc[0].role = params[key];
                    }

                    if(key === 'password' && params[key].length === 0) {
                        continue;
                    }

                    if(key === 'xpassword' && params[key].length > 0) {
                        doc[0].password = params[key];
                    }

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
 * get all users
 *
 * @request get
 * @url user/
 */
route.get('/', (req, res) => {
    db.select(User, {}, { password: 0})
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
 * get all users
 *
 * @request get
 * @url user/
 */
route.get('/e/:email', (req, res) => {
    let userEmail = req.user.email,
        where = [];

    where.push({'email': userEmail});

    db.select(User, where)
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
 * get current user
 *
 * @request get
 * @url user/current
 */
route.get('/a', (req, res) => {
    let userId = req.user._id,
        where = [];

    where.push({'_id': userId});

    db.select(User, where)
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
 * get user
 *
 * @request get
 * @url user/:id
 */
route.get('/:id', (req, res) => {
    let userId = req.params.id,
        where = [];

    where.push({'_id': userId});

    db.select(User, where, { password: 0})
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
 * active user
 *
 * @request post
 * @url user/:id/active
 */
route.post('/:id/active', (req, res) => {
    let userId = req.params.id,
        where = [];


    if(!JS.Middleware.isAdmin(req)) {
        res.statusCode = statusCode.forbidden;
        res.send();
    }

    where.push({'_id': userId});

    db.select(User, where)
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
                doc[0].role = 'user';
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
 * admin user
 *
 * @request post
 * @url user/:id/admin
 */
route.post('/:id/admin', (req, res) => {
    let userId = req.params.id,
        where = [];

    if(!JS.Middleware.isAdmin(req)) {
        res.statusCode = statusCode.forbidden;
        res.send();
    }

    where.push({'_id': userId});

    db.select(User, where)
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
                doc[0].role = 'admin';
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
 * delete user
 *
 * @request delete
 * @url user/:id
 */
route.delete('/:id', (req, res) => {
    if(!JS.Middleware.isAdmin(req)) {
        res.statusCode = statusCode.forbidden;
        res.send();
    }

    let userId = req.params.id;

    db.remove(User, { _id: userId })
        .then(() => {
            res.statusCode = statusCode.deleted;
            res.send();
        })
        .catch(() => {
            res.statusCode = statusCode.notfound;
            res.send();
        });
});

/**
 * add user
 *
 * @request post
 * @url user/
 */
route.post('/', (req, res) => {
    if(!JS.Middleware.isAdmin(req)) {
        res.statusCode = statusCode.forbidden;
        res.send();
    }

    const user = new User(req.body);

    user.save((error) => {
      if (error) {
        res.statusCode = statusCode.notfound;
        return res.send();
      }

      res.statusCode = statusCode.created;
      res.send();
    });
});

module.exports = route;
