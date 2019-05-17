var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index1');
var usersRouter = require('./routes/users');
var passport = require('passport');

var http = require('https');
var app = module.exports.app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance

io.on('connection', function(socket) {
    socket.emit('news', {hello: 'world'});
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

var flash = require('connect-flash');
var user = require('./models/user');

require('./config/passport')(passport);











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
passport.serializeUser((user.serializeUser()));
passport.deserializeUser((user.deserializeUser()))


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