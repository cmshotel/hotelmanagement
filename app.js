var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require('fs');
var index = require('./routes');
var avail = require('./routes/availMod/');
var book = require('./routes/book/');
var modifybook = require('./routes/modifybook/');
var charts = require('./routes/charts/');
var history = require('./routes/history/');
var theme = require('./routes/theme');
var settings = require('./routes/settings');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(cookieParser());
app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: 'Bravo36@',
  resave: false,
  saveUninitialized: true,
  /* 
   * https://github.com/expressjs/session#cookiesecure
   */
  /* cookie: {
    secure: true
  } */
}));


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/vendor')));
app.use(express.static(path.join(__dirname, 'views/theme')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'node_modules')));
/*
 */
app.use('/', index);
app.use('/availability', avail);
app.use('/booking', book);
app.use('/modifybooking',modifybook);
app.use('/history', history);
app.use('/theme', theme);
app.use('/charts', charts);
app.use('/settings', settings);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;