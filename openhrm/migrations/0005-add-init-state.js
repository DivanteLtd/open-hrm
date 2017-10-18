exports.up = function (db, next) {
  let states = db.collection('leadstates');

  states.insert({
    code: 'New New candidate',
    name: 'New'
  }, next);
};

exports.down = function (db, next) {
  let states = db.collection('leadstates');
  states.findAndModify({code: 'New'}, [], {}, {remove: true}, next);
};