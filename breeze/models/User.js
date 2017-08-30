'use strict';
var bcrypt = require('bcrypt-nodejs'),
    crypto = require('crypto'),
    mongoose = require('mongoose'),
    config = require('./../config'),

    userSchema = new mongoose.Schema({
        email: { type: String, unique: true, lowercase: true },
        password: {
          type: String,
          set: function (password) {
            const salt = bcrypt.genSaltSync(5);
            const hash = bcrypt.hashSync(password, salt);

            return hash;
          }
        },
        role: { type: String, enum: config.user.role, default: config.user.default },

        facebook: String,
        twitter: String,
        google: String,
        github: String,
        instagram: String,
        linkedin: String,
        tokens: Array,

        profile: {
            name: { type: String, default: '' },
            shortname: { type: String, default: '' },
            gender: { type: String, default: '' },
            location: { type: String, default: '' },
            website: { type: String, default: '' },
            picture: { type: String, default: '' }
        },

        resetPasswordToken: String,
        resetPasswordExpires: Date
    });


/**
 * Set default ppicture using gravatar
 */
userSchema.post('init', function(data, next) {

    if(!data.profile.picture) {
      data.profile.picture = this.gravatar();
    }

    next();
});

/**
 * Password hash middleware.
 */
// userSchema.pre('save', (next) => {
//     'use strict';
//     var user = this;
//     console.log(user);
//     if (!user.isModified('password')) {
//         return next();
//     }
//
//     bcrypt.genSalt(5, (err, salt) => {
//         if (err) {
//             return next(err);
//         }
//
//         bcrypt.hash(user.password, salt, null, (err, hash) => {
//             if (err) {
//                 return next(err);
//             }
//
//             user.password = hash;
//             next();
//         });
//     });
// });

/**
 * Helper method for validating user's password.
 */

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

/**
 * Helper method for getting user's gravatar.
 */

userSchema.methods.gravatar = function(size)  {
    if (!size) {
        size = 200;
    }

    if (!this.email) {
        return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
    }

    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

userSchema.set('toObject', { getters: true, setters: true });
userSchema.set('toJSON', { getters: true, setters: true });

module.exports = mongoose.model('User', userSchema);
