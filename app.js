"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var express = require("express");
var http = require("http");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var main_1 = require("./routes/main");
var app = express();
var server = http.createServer(app);
var constants_1 = require("./constants");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
for (var _i = 0, serveModules_1 = constants_1.serveModules; _i < serveModules_1.length; _i++) {
    var theModule = serveModules_1[_i];
    app.use("/" + theModule, express.static(path.join(__dirname, "node_modules", theModule)));
}
app.use(express.static(path.join(__dirname, "public")));
app.use('/', main_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err['status'] || 500);
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
app.set('port', process.env.PORT);
server.listen(app.get('port'), function () { console.log("Listening on port " + process.env.PORT); });
//# sourceMappingURL=app.js.map