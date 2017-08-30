'use strict';

var express = require('express'),
    route = express.Router(),
    User = require('./../models/User'),
    JS = require('./../libs'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    statusCode = JS.Globals.http.statusCode,
    db = JS.Promises.db,
    config = require('../config.js'),
    emails = require('../templates/emails.js'),
    mailer = require('nodemailer'),
    crypto = require('crypto');


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({usernameField: 'email'}, function (email, password, done) {
    email = email.toLowerCase();
    User.findOne({email: email}, function (err, user) {
        if (!user) {
            return done(null, {id: 0, name: 'guest'}, {message: 'Email ' + email + ' not found'});
        }
        user.comparePassword(password, function (err, isMatch) {
            if (isMatch) {
                return done(null, user);
            } else {
              //  return done(null, user);
               return done(null, {id: 0, name: 'guest'}, {message: 'Invalid email or password.'});
            }
        });
    });
}));

/**
 * login user
 *
 * @request post
 * @url auth/
 */
route.post('/', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) {
            return next(err);
        }

        if (user.id === 0) {
            res.statusCode = statusCode.forbidden;
            res.send();
            return;
        }

        // if (user.role === 'pending') {
        //     res.statusCode = 501;
        //     res.send();
        //     return;
        // }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }

            res.statusCode = statusCode.accepted;
            res.send();
        });
    })(req, res, next);
});

/**
 * register user
 *
 * @request post
 * @url auth/new
 */
route.post('/new', (req, res) => {
    let user = new User();

    for (let key in req.body) {
        user[key] = req.body[key];
    }

    db.save(user)
        .then((doc) => {
            res.statusCode = statusCode.created;
            res.json({
                'insertId': doc._id
            });
        })
        .catch(() => {
            res.statusCode = statusCode.bad;
            res.send();
        });
});

/**
 * logout user
 *
 * @request get
 * @url auth/
 */
route.get('/', (req, res) => {
    req.logout();
    res.statusCode = statusCode.ok;
    res.send();
});

/**
 * check is auth
 *
 * @request get
 * @url auth/check
 */
route.get('/check', (req, res) => {
    var auth = req.isAuthenticated();

    if (auth) {

        if(req.user.role === 'pending') {
            res.statusCode = 501;
            res.send();
            return;
        }

        res.statusCode = statusCode.accepted;
        res.json(req.user);
    } else {
        res.statusCode = statusCode.forbidden;
        res.send();
    }
});

route.get('/admin', (req, res) => {
    var auth = req.isAuthenticated();


    if (auth) {
        res.statusCode = statusCode.accepted;
        res.json(req.user);
    } else {
        res.statusCode = statusCode.forbidden;
        res.send();
    }
});

/**
 * forget password
 *
 * @request put
 * @url auth/forgot
 */

route.put('/forgot', (req, res) => {
  if (!emails.validateEmail(req.body.email)) {
    res.status(400).send({ code: 400, message: 'Please provide valid email addesss.' });
    return;
  }

  var hash;

  const email = req.body.email.toLowerCase();
  User.findOne({email: email}, function (err, user) {
    if (err) {
      console.error(err); // eslint-disable-line
      res.status(404).send({ code: 404, message: 'No data found' });
      return;
    }
    if(!user) {
      res.status(404).send({ code: 404, message: 'no user' });
      return;
    }

    var date = new Date().toString();
    hash = crypto.createHash('md5').update(date).digest('hex');

    user.resetPasswordToken = hash;
    user.resetPasswordExpires = Date.now() + 3600000;

    db.save(user)
        .then(()=>{
          const mailOptions = Object.assign(config.mailer.options, {
            html: emails.emailTemplate(req.body.email, hash, `${req.protocol}://${req.get('host')}`),
            to: req.body.email,
          });

          const transporter = mailer.createTransport(config.mailer.smtpUrl);
          transporter.sendMail(mailOptions, (error) => {
            if (error) {
              console.error(error); // eslint-disable-line
              res.status(500).send({ code: 500, message: 'There was an error sending your email.' });
              return;
            }
            res.status(200).send({
              code: 200,
              message: 'Email sent. Thanks for contacting us. We\'ll reply soon.',
            });
          });
        })
        .catch(() => {
            res.statusCode = statusCode.bad;
            res.send();
        });

  });
});

/**
 * change password nodemailer
 *
 * @request put
 * @url auth/generatePass
 */

 route.put('/generatePass', (req, res) => {
   User.findOne({email: req.body.email, resetPasswordToken: req.body.token}, function (err, user) {
     if (err) {
       console.error(err); // eslint-disable-line
       res.status(404).send({ code: 404, message: 'invalid email or token' });
       return;
    }
    if (user.resetPasswordExpires < new Date()){
        res.status(400).send({ code: 400, message: 'token expired' });
    }

    user.password= req.body.password;
    db.save(user)
      .then(() => {
          user.resetPasswordToken = '';
          user.resetPasswordExpires = null;
          res.status(200).send({ code: 200 });
      })
      .catch(() => {
          res.statusCode = statusCode.bad;
          res.send();
      });
    });
});


module.exports = route;
