'use strict';

const
  regexRoute = /(\w+)(\.route\.js)$/i,
  bodyParser = require('body-parser'),
  config = require('./config'),
  JS = require('./libs'),
  cookieParser = require('cookie-parser'),
  express = require('express'),
  mongoose = require('mongoose'),
  api = require('./routes/api.plugin'),
  passport = require('passport'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  path = require('path'),
  fs = require('fs'),
  // morgan = require('morgan'),
  app = express();

mongoose.connect(config.db);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(path.resolve(__dirname, './public')));

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.session,
  store: new MongoStore({ url: config.db, autoReconnect: true })
}));

app.use(passport.initialize());
app.use(passport.session());
// app.use(morgan('combined'));

/* api */
app.use('/api', api);

for(let route of fs.readdirSync(path.join(__dirname, './routes'))) {
  let match = regexRoute.exec(route);
  
  if(match !== null && match[1] !== 'auth') {
    app.all('/' + match[1], JS.Middleware.requireAuth);
  }
  
  if(match !== null) {
    app.use('/' + match[1], require('./routes/' + match[1] + '.route'));
  }
}

app.route('/*').get((req, res) => {
  res.sendFile(path.resolve(__dirname, './public/index.html'));
});

app.listen(config.port, () => {
  console.log('Server is listening on port', config.port);
});