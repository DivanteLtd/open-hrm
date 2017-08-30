var mongoose = require('mongoose');

var sourceSchema = new mongoose.Schema({
    name: String
});

module.exports = mongoose.model('Source', sourceSchema);
module.exports.schema = sourceSchema;