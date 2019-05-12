var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var passport = require('passport');
var app = express();
var flash = require('connect-flash');

require('./config/passport')(passport);
var LocalStrategy = require('passport-local').Strategy;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// express-session settings
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);


// initialization middleware for passport local strategy
app.use(passport.initialize());
app.use(passport.session());


// flash messages
app.use(flash());

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success');
    res.locals.warning_msg = req.flash('warning');
    res.locals.error = req.flash('error');
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

// routes' directory handling
app.use('/', indexRouter);
app.use('/', usersRouter);


//passport config
//var User = require('./models/user');
//passport.use(new LocalStrategy(User.authenticate()));
//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;