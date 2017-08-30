var mongoose = require('mongoose');

var positionSchema = new mongoose.Schema({
    name: String
});

module.exports = mongoose.model('Position', positionSchema);
module.exports.schema = positionSchema;