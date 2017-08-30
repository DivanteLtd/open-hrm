'use strict';

var express = require('express'),
    Note = require('../models/Note'),
    JS = require('./../libs'),
    statusCode = JS.Globals.http.statusCode,
    db = JS.Promises.db,
    route = express.Router();

/**
 * add new note
 *
 * @request post
 * @url note/
 */
route.post('/', (req, res) => {
    let note = new Note();

    note.createdAt = new Date();
    note.updatedAt = note.createdAt;
    note.content = req.body.content;
    note.type = req.body.type || 'Note';
    note.parentId = req.body.parentId ;
    note.parentType = req.body.files;
    note.files = req.body.files;
    note.owner = req.user._id;

    db.save(note)
        .then((doc) => {
            res.statusCode = statusCode.created;
            res.json({
                'noteId': doc._id
            });
        })
        .catch(() => {
            res.statusCode = statusCode.bad;
            res.send();
        });
});

/**
 * Edit note
 *
 * @request put
 * @url note/:id
 */
route.put('/:id', (req, res) => {
    var noteId = req.body._id,
        params = req.body,
        where = [];
    where.push({'_id': noteId});

    db.select(Note, where)
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
                doc[0].updatedAt = new Date();
                return db.save(doc[0]);
            }
        })
        .then((doc) => {
            if(doc) {
                res.statusCode = statusCode.created;
                res.json({
                    'insertId': doc._id
                });
            }
        })
        .catch(() => {
            res.statusCode = statusCode.notfound;
            res.send();
        });
});

/**
 * get note
 *
 * @request get
 * @url note/:id
 */
route.get('/:id', (req, res) => {
    let noteId = req.params.id,
        where = [];

    where.push({'_id': noteId});

    db.select(Note, where)
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
 * delete note
 *
 * @request delete
 * @url note/:id
 */
route.delete('/:id', (req, res) => {
    let noteId = req.params.id;

    db.remove(Note, { _id: noteId })
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