'use strict';

var express = require('express'),
    route = express.Router(),
    Lead = require('./../models/Lead'),
    JS = require('./../libs'),
    statusCode = JS.Globals.http.statusCode,
    db = JS.Promises.db;


/**
 * get all tags
 *
 * @request get
 * @url tags/
 */
route.get('/', (req, res) => {
    var tags = new Set();

    db.select(Lead, {})
        .then((docs) => {
            if(!docs) {
                res.statusCode = statusCode.notfound;
                res.send();
            } else {
                return docs;
            }
        })
        .then((docs) => {
            if(docs) {
                for (let item of docs) {
                    tags.add(item.tags);
                }

                res.statusCode = statusCode.ok;
                return res.json(Array.from(tags));
            }
        })
        .catch(() => {
            res.statusCode = statusCode.notfound;
            res.send();
        });
});

module.exports = route;
