var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var session = require('express-session');
var app = express();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser((user, done) => {
    console.log('user serialize');
    done(null, user);
})
passport.deserializeUser((user, done) => {
    console.log('deserialize');
    done(null, user);
});

passport.use(new FacebookStrategy({
        clientID: '1414757838784943',
        clientSecret: '3a2a06d3b803e1f1ab4128d5f1e9262a',
        callbackURL: 'http://localhost:3000/auth/callback/facebook',
        profileFields:['id','email','photos','displayName','birthday','age_range','gender','hometown','interested_in','location']
    },
    function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        done(null,profile);
    })
)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
        secret: 'infly_sns_login_test_App',
        saveUninitialized: false
    })
)

app.use('/', index);
app.use('/users', users);

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
