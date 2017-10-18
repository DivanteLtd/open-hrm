'use strict';

var express = require('express'),
    fs = require('fs'),
    File = require('../models/File'),
    JS = require('./../libs'),
    statusCode = JS.Globals.http.statusCode,
    db = JS.Promises.db,
    route = express.Router(),
    path = require('path'),
    crypto = require('crypto'),
    uploadPath = path.resolve('./public/uploads');



route.post('/', (req, res) => {


    var body = '';
    var header = '';
    var contentType = req.headers['content-type'];
    var boundary = contentType.split('; ')[1].split('=')[1];
    //var contentLength = parseInt(req.headers['content-length']);
    var headerFlag = true;
    var filename = '';
    var filenameRegexp = /filename="(.*)"/m;



    req.on('data', function(raw) {
        var i = 0;
        while (i < raw.length) {
            if (headerFlag) {
                var chars = raw.slice(i, i + 4).toString();
                if (chars === '\r\n\r\n') {
                    headerFlag = false;
                    header = raw.slice(0, i + 4).toString();
                    i = i + 4;
                    // get the filename
                    var result = filenameRegexp.exec(header);
                    if (result[1]) {
                        filename = result[1];
                    }
                }
                else {
                    i += 1;
                }
            }
            else {
                // parsing body including footer
                body += raw.toString('binary', i, raw.length);
                i = raw.length;
            }
    }
    });

    req.on('end', function() {
        var d = new Date();
        var time = d.getTime();
        var hash = crypto.createHash('md5').update(filename+time).digest('hex');
        var reg = /\.[0-9a-z]{1,5}$/i;
        var maches = filename.match(reg);
        var extn = maches[0];

        body = body.slice(0, body.length - (boundary.length + 8));
        fs.writeFileSync(uploadPath+'/'+hash, body, 'binary');

        let file = new File();

        file.createdAt = new Date();
        file.updatedAt = file.createdAt;
        file.name = filename;
        file.type = extn.replace('.','');
        file.hash = hash;
        file.owner = req.user._id;
        file.parentId = req.lid || '';

        db.save(file)
            .then((doc) => {
                res.statusCode = statusCode.created;
                res.json({
                    'fileId': doc._id,
                    'fileName':file.name,
                    'fileType': file.type,
                    'fileHash': file.hash
                });
            })
            .catch(() => {
                res.statusCode = statusCode.bad;
                res.send();
            });

        console.log('done');
    });
});



/**
 * get file
 *
 * @request get
 * @url file/:id
 */
route.get('/:id', (req, res) => {

    let fileId = req.params.id,
    where = [];

    where.push({'_id': fileId});

    db.select(File, where)
        .then((docs) => {
        res.statusCode = statusCode.ok;
        res.json(docs);
    })
    .catch(() => {
        res.statusCode = statusCode.bad;
        res.send();
    });
});

route.post('/f/:hash', (req, res) => {

    var hash = req.params.hash;

    fs.readFile(uploadPath + '/' + hash, function (err, data) {
        if (err) {
            res.writeHead(400);
            res.end('' + err);
            return;
        }
        res.writeHead(
            200,
            {}
        );
        res.end(data);
    });
});

/**
 * delete file
 *
 * @request delete
 * @url file/:id
 */
route.delete('/:id/:hash', (req, res) => {

    var hash = req.params.hash;

    //delete from disk
    fs.unlinkSync(uploadPath+'/'+hash);

    let fileId = req.params.id;
    // delete from databse
    db.remove(File, { _id: fileId })
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