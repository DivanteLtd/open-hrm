'use strict';

var JS = JS || {};

/**
 * Globals
 *
 * @method Globals
 */
JS.Globals = {
  http: {
    statusCode: {
      ok: 200,
      created: 201,
      accepted: 202,
      deleted: 204,
      bad: 400,
      unAuth: 401,
      forbidden: 403,
      notfound: 404
    }
  }
};

/**
 * Middleware
 *
 * @method Middleware
 */
JS.Middleware = {
  isAdmin: (req) => {
    return (req.user.role === 'admin');
  },
  
  requireAuth: (req, res, next) => {
    var auth = req.isAuthenticated();
    
    if(req.user.role === 'pending') {
      res.statusCode = 501;
      res.send();
      return;
    }
    
    if(auth) {
      next();
    } else {
      res.statusCode = JS.Globals.http.statusCode.forbidden;
      res.send();
    }
  }
};

/**
 * Promises
 *
 * @method Promises
 */
JS.Promises = {
  db: {
    save: (doc) => {
      return new Promise((resolve, reject) => {
        doc.save((err, docItem) => {
          if (err) {
            console.log(err);
            reject(new Error(err));
          } else {
            resolve(docItem);
          }
        });
      });
    },
    remove: (doc, query) => {
      return new Promise((resolve, reject) => {
        doc.remove(query, (err) => {
          if (err) {
            reject(new Error(err));
          } else {
            resolve();
          }
        });
      });
    },
    selectPaginated: (doc, skip, limit, where, sort) => {
      return new Promise((resolve, reject) => {
        let query = doc.find(where).sort(sort);
        
        query.count((err, count) => {
          if(err) {
            reject(new Error(err));
          } else {
            query.limit(limit).skip(skip).exec('find', (err, docs) => {
              if (err) {
                reject(new Error(err));
              } else {
                resolve({
                  results: docs,
                  total: count,
                });
              }
            });
          }
        });
      });
    },
    select: (doc, where, projection, limit, skip) => {
      var _projection = projection || {};
      return new Promise((resolve, reject) => {
        let query = doc.find({}, _projection).limit(limit).skip(skip);
        
        if(typeof where !== 'undefined') {
          for (var i = 0; i < where.length; i++) {
            query.where(where[i]);
          }
        }
        
        query.exec((err, docs) => {
          if (err) {
            reject(new Error(err));
          } else {
            resolve(docs);
          }
        });
      });
    }
  }
};

module.exports = JS;
