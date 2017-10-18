/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,

  leadSchema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    subtitle: {type: ObjectId, ref: 'Position'},
    state: {type: ObjectId, ref: 'State'},
    tags: String,
    cv: {},
    source: {type: ObjectId, ref: 'Source'},
    contact: {
      fullName: {type: String, required: true, trim: true},
      firstName: {type: String, required: false, trim: true},
      lastName: {type: String, required: false, trim: true},
      email: {
        type: String,
        required: false,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w*)+$/, 'Please fill a valid email address']
      },
      phone: {type: String, required: false, trim: true},
      social: {
        linkedin: {type: String, default: ''},
        goldenline: {type: String, default: ''},
        facebook: {type: String, default: ''}
      },
      companyName: String,
      companyPosition: String,
      country: String,
      city: String,
      address: String
    },
    salary: {
      contract: String,
      net: Number,
      gross: Number,
      cost: Number,
      currency: String
    },
    experience: Object,
    language: Object,
    education: Object,
    recruiter: {type: ObjectId, ref: 'User'},
    owner: {type: ObjectId, ref: 'User'},
    createdBy: {type: ObjectId, ref: 'User'},
    registeredBy: {type: ObjectId, ref: 'User'},
    description: String
  });

module.exports = mongoose.model('Lead', leadSchema);