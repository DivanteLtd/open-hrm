/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var noteSchema = new mongoose.Schema({

    createdAt: Date,
    updatedAt: Date,

    content: String,
    type: String,

    files: [Schema.Types.Mixed],

    parentId: { type: mongoose.Schema.ObjectId },
    parentType: String,
    leadId: {type: ObjectId, ref: 'Lead'},
    owner: { type: ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Note', noteSchema);
module.exports.schema = noteSchema;