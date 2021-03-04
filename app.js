var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");

var JwtAuthToken = require("./config/JwtAuthToken");

var routes = require('./routes/index');
var users = require('./routes/users');




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// MongoDB
mongoose.connect("mongodb://localhost/aexonicTechnologiesJanardan",
    { useNewUrlParser: true },
    function (err, connect) {
        if (err) {
            console.log("Not connected--->", err);
        } else {
            console.log("Connected...");
        }
    });


app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));







function loginfo(req, res, next) {
    console.log("--------------------------------------------------------------------------------------");
    var authenticationtoken = "";
    authenticationtoken = req.headers.authenticationtoken
    JwtAuthToken.JwtAuthTokenVerify(req.headers.authenticationtoken, function (cb) {
        console.log("cb-->", cb);
        if (cb == "true") {
            next();
        } else {
            res.json({ status: "JWTERROR", msg: "", data: cb });
        }
    })

};






app.use('/', routes);
app.use(loginfo);
app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
