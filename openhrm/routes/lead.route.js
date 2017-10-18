'use strict';

var express = require('express'),
  Lead = require('./../models/Lead'),
  Note = require('../models/Note'),
  File = require('../models/File'),
  Source = require('../models/Source'),
  LeadState = require('../models/LeadState'),
  JS = require('./../libs'),
  statusCode = JS.Globals.http.statusCode,
  db = JS.Promises.db,
  route = express.Router(),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;


/**
 * Add new lead
 *
 * @request post
 * @url lead/
 */
route.post('/', (req, res) => {
  let lead = new Lead();

  lead.createdAt = new Date();
  lead.owner = req.body.owner || req.user._id;
  lead.createdBy = req.body.registeredBy || req.user._id;
  lead.registeredBy = req.user._id;
  lead.state = req.body.state;


  lead.description = req.body.description;
  lead.tags = req.body.tags;
  lead.experience = req.body.experience;
  lead.language = req.body.language;
  lead.education = req.body.education;

  lead.source = req.body.source;
  lead.contact = req.body.contact;
  lead.subtitle = req.body.subtitle;
  lead.salary = req.body.salary;

  lead.note = req.body.note;

  for (let i = lead.language.length - 1; i >= 0; i -= 1) {
    if (!lead.language[i].language || lead.language[i].language.length === 0) {
      lead.language.splice(i, 1);
    }
  }

  for (let i = lead.education.length - 1; i >= 0; i -= 1) {
    if (!lead.education[i].school || lead.education[i].school.length === 0) {
      lead.education.splice(i, 1);
    }
  }

  for (let i = lead.experience.length - 1; i >= 0; i -= 1) {
    if (!lead.experience[i].position || lead.experience[i].position.length === 0) {
      lead.experience.splice(i, 1);
    }
  }

  if (req.body.cv !== undefined) {
    lead.cv = req.body.cv;
  }

  db.save(lead)
    .then((doc) => {

      if (lead.note !== '') {
        let note = new Note();

        note.createdAt = new Date();
        note.updatedAt = note.createdAt;
        note.content = lead.note;
        note.type = 'Note';
        note.parentId = doc._id;
        note.owner = doc._id;

        db.save(note).then((doc) => {
          res.statusCode = statusCode.created;
          res.json({
            'insertId': doc._id
          });
        })
          .catch(() => {
            res.statusCode = statusCode.bad;
            res.send();
          });
      } else {
        res.statusCode = statusCode.created;
        res.json({
          'insertId': doc._id
        });
      }
    })
    .catch(() => {
      res.statusCode = statusCode.bad;
      res.send();
    });
});

function addNotes(parentId, notes, userId) {
  notes = notes || [];
  return Promise.all(notes.map(content => {
    let note = new Note();

    note.createdAt = new Date();
    note.updatedAt = note.createdAt;
    note.content = content;
    note.type = 'Note';
    note.parentId = parentId;
    note.owner = userId;

    return db.save(note);
  }));
}

route.post('/import', (req, res) => {
  let candidateId;

  let lead = new Lead();

  lead.createdAt = new Date();
  lead.owner = req.user._id;
  lead.createdBy = req.user._id;
  lead.registeredBy = req.user._id;
  lead.description = req.body.description;
  lead.tags = req.body.tags;
  lead.experience = req.body.experience;
  lead.language = req.body.language;
  lead.education = req.body.education;
  lead.subtitle = req.body.position;

  db.select(Source, [{name: {$regex: '.*' + req.body.source + '.*', $options: 'i'}}])
    .then((sources) => {
      lead.source = sources[0]._id;
      lead.contact = req.body.contact;

      const social = {};
      switch (req.body.source) {
        case 'LinkedIn':
          social.linkedin = req.body.url;
          break;
        case 'GoldenLine':
          social.goldenline = req.body.url;
          break;
      }
      lead.contact.social = social;
      return db.select(LeadState, [{'_id': req.body.stateId}]);
    })
    .then((states) => {
      if (states.length > 0) {
        lead.state = states[0];
      }
      return db.save(lead);
    })
    .then((doc) => {
      candidateId = doc._id;
      return addNotes(doc._id, req.body.notes, req.user._id);
    })
    .then(() => {
      res.statusCode = statusCode.created;
      res.json({id: candidateId});
    })
    .catch(() => {
      res.statusCode = statusCode.bad;
      res.send();
    });
});

/**
 * Edit lead
 *
 * @request put
 * @url lead/:id
 */
route.put('/:id', (req, res) => {
  var leadId = req.params.id,
    params = req.body,
    where = [];
  where.push({'_id': leadId});
  db.select(Lead, where)
    .then((doc) => {
      if (!doc) {
        res.statusCode = statusCode.notfound;
        res.send();
      } else {
        return doc;
      }
    })
    .then((doc) => {
      if (doc) {
        for (let key in params) {
          doc[0][key] = params[key];
        }
        return db.save(doc[0]);
      }
    })
    .then((doc) => {
      if (doc) {
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
 * Get all leads
 *
 * @request get
 * @url lead/
 */
route.get('/', (req, res) => {
  var where = JSON.parse(req.query.where);
  var sort = JSON.parse(req.query.orderBy) || {};

  db.selectPaginated(Lead, parseInt(req.query.skip), parseInt(req.query.limit), where, sort)
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
 * Get lead
 *
 * @request get
 * @url lead/:id
 */
route.get('/:id', (req, res) => {
  let leadId = req.params.id,
    where = [];
  where.push({'_id': leadId});

  db.select(Lead, where)
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
 * Get all notes for selected lead
 *
 * @request get
 * @url lead/:id/note
 */
route.get('/:id/note', (req, res) => {
  let leadId = req.params.id,
    where = [];

  where.push({'parentId': leadId});

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
 * Get all files for selected lead
 *
 * @request get
 * @url lead/:id/file
 */
route.get('/:id/file', (req, res) => {

  let leadId = req.params.id,
    where = [];

  where.push({'parentId': leadId});

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

/**
 * edit lead tags
 *
 * @request put
 * @url lead/:id/tags
 */
route.put('/:id/tags', (req, res) => {

  var leadId = req.body._id,
    params = req.body,
    where = [];

  where.push({'_id': leadId});

  db.select(Lead, where)
    .then((doc) => {
      if (!doc) {
        res.statusCode = statusCode.notfound;
        res.send();
      } else {
        return doc;
      }
    })
    .then((doc) => {
      if (doc) {
        doc[0].tags = params.tags;
        return db.save(doc[0]);
      }
    })
    .then((doc) => {
      if (doc) {
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
 * delete lead
 *
 * @request delete
 * @url lead/:id
 */
route.delete('/:id', (req, res) => {
  let leadId = req.params.id;

  db.remove(Lead, {_id: leadId})
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
