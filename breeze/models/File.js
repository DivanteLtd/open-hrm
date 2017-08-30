

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var fileSchema = new mongoose.Schema({

    createdAt: Date,
    updatedAt: Date,

    name: String,
    type: String,
    hash: String,

    parentId: { type: mongoose.Schema.ObjectId },
    parentType: String,

    leadId: {type: ObjectId, ref: 'Lead'},
    owner: { type: ObjectId, ref: 'User' }
});

module.exports = mongoose.model('File', fileSchema);
module.exports.schema = fileSchema;