var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var redis = require('redis');
var client = redis.createClient();
var ejs = require('ejs');
//var mongo = require('mongodb');
//var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/bpf-omega-api');

//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function () {
  // we're connected!
//  console.log('database connected');
//});
client.on('connect', function() {
    console.log('connected to redis');
});

var stocks = require('./routes/stock');
//var quote = require('./routes/quote');
var help = require('./routes/help');

var app = express();

// view engine setup
app.set('view engine', 'ejs');
app.engine('.html', require('ejs').renderFile);
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    //req.db = db;
    next();
});

app.use('/stock', stocks);
//app.use('/quote', quote);
app.use('/', help);
app.use(cors());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error.html', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
