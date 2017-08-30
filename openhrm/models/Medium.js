var mongoose = require('mongoose');

var mediumSchema = new mongoose.Schema({
    name: String
});

module.exports = mongoose.model('Medium', mediumSchema);
module.exports.schema = mediumSchema;