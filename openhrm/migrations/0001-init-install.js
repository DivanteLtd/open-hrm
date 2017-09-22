
exports.up = function (db, next) {
  let sources = db.collection('sources');
  let positions = db.collection('positions');

  positions.insert({name: 'Vue.js developer'});
  sources.insertMany([
      {name: 'Linkedin'},
      {name: 'Website'},
      {name: 'Personal referral'},
    ]
    , next);
};

exports.down = function (db, next) {
  let sources = db.collection('sources');
  let positions = db.collection('positions');

  positions.findAndModify({name: 'Vue.js developer'}, [], {}, {remove: true});
  sources.findAndModify({name: 'Linkedin'}, [], {}, {remove: true});
  sources.findAndModify({name: 'Website'}, [], {}, {remove: true});
  sources.findAndModify({name: 'Personal referral'}, [], {}, {remove: true}, next);
};