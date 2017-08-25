var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var flash         = require('express-flash');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var bodyParser    = require('body-parser');
var sassMiddleWare= require('node-sass-middleware');
var app           = express();
var server        = require('http').Server(app);

function Raffler(config) {
    this.init = () => {
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(require('./controllers'));
    };

    this.initSassMiddleWare = () => {
        var srcPath = __dirname + "/sass";
        var destPath = __dirname + "/public/css";

        app.use('/css', sassMiddleWare({
            src: srcPath,
            dest: destPath,
            debug: true,
            outputStyle: 'expanded'
        }));
    }

    this.initErrorHandler = () => {
        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // error handler
        app.use(function(err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error/error', {'message':err.message});
        });
    };

    this.start = () => {
        var self = this;
        self.initSassMiddleWare();
        self.init();
        self.initErrorHandler();
    };
};

Raffler.startInstance = () => {
    var Configuration = require('./config.js');
    var config = Configuration.load();
    var raffler = new Raffler(config);
    raffler.start();
    return raffler;
}

Raffler.startInstance();

module.exports = {app: app, server: server};
