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
var cookieParser  = require('cookie-parser');
var session       = require('client-sessions');
var firebase      = require('firebase');
const OneSignalClient = require('node-onesignal-api');
const push_client = new OneSignalClient({
   appId: '7be96e60-3549-4004-bfc7-a8f191fb8bfe',
   restApiKey: 'OWJkM2EyMDMtZWUwYi00Y2VkLWFjMDYtMGI3YTAzYzM2MWM4'
});

var config = {
  apiKey: "AIzaSyD-8--1ZFgnfx97q9lMq0vPAE52tz_hYFY",
  authDomain: "raffler-fbf05.firebaseapp.com",
  databaseURL: "https://raffler-fbf05.firebaseio.com",
  storageBucket: "gs://raffler-fbf05.appspot.com",
};
firebase.initializeApp(config);

var AWS         = require('aws-sdk');
AWS.config.update({
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET,
        region: 'us-east-1'
    });
AWS.config.apiVersions = {
    s3: '2012-10-17'
};

function Raffler(config) {
    this.init = () => {
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');
        app.use(logger('dev'));
        app.use(bodyParser.json({limit:"5mb"}));
        app.use(bodyParser.urlencoded({limit:"5mb", extended: true }));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(session({
            cookieName: 'session',
            secret: 'eg[isfd-8yF9-7w2315df{}+Ijslito8',
            duration: 30 * (60 * 1000),
            activeDuration: 15 * (60 * 1000),
        }));
        app.use(authCheck);
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

    this.doBackgroundJob = () => {
        var http = require('https');
        setInterval(function(){
            http.get('https://raffler-admin.herokuapp.com/');
        },300000);

        setInterval(function(){
            
        }, 60000);

        doManageRaffle();
        
    }

    function getRandom(num, arr){
        arr.sort( function() { return 0.5 - Math.random() } );
        return arr.splice(0, num);
    }

    function sendPushNotification(message, pushTokens){
        push_client.createNotification({
            contents: {
                contents: message
            },
            specific: {
                include_player_ids: pushTokens
            },
            attachments: {
                data: {
                    hello: message
                }
            }
        }).then(success => {
            console.log('sendPush', success);
        })
    }

    function contains(a, obj) {
        var i = a.length;
        while (i--) {
            var map = a[i];
            if (map.uid === obj.uid) {
                return true;
            }
        }
        return false;
    }

    function doManageRaffle(){
        var d = new Date();
        var currentTime = d.getTime();
        console.log("server time", currentTime);
        // check winner for every raffles
        var query = firebase.database().ref('Raffles').orderByChild('isClosed').equalTo(false);
        query.once('value', function(snapshot){
            if (snapshot.val() != null) {
                snapshot.forEach(function(obj){
                    var key = obj.key;
                    var title = obj.val().title;
                    var description = obj.val().description;
                    var ending_date = obj.val().ending_date;
                    var winners_num = obj.val().winners_num;
                    var raffles_num = obj.val().raffles_num;
                    var imageLink = obj.val().imageLink;
                    var isClosed = obj.val().isClosed;

                    if (ending_date <= currentTime) {
                        var queryToFindRafflers = firebase.database().ref('Holders').child(key);
                        queryToFindRafflers.once('value', function(holderSnapshot){
                            if (holderSnapshot.val() != null) {
                                var holders = new Array();
                                for(var index in holderSnapshot.val()){
                                    holders.push(holderSnapshot.val()[index]);
                                }

                                var candidates = new Array();
                                if (holders.length > winners_num) {
                                    candidates = getRandom(winners_num, holders);
                                } else {
                                    candidates = holders;
                                }

                                var winners = candidates.filter((elem, index, self) => self.findIndex((t) => {return t.uid === elem.uid}) === index);
                                var remains = new Array();
                                for (var i = holders.length-1; i >= 0; i--) {
                                    var holder = holders[i];
                                    if (!contains(winners, holder)){
                                        remains.push(holder);
                                    }
                                }
                                
                                var losers = remains.filter((elem, index, self) => self.findIndex((t) => {return t.uid === elem.uid}) === index);

                                console.log('winners', winners);
                                console.log('losers' , losers);

                                var winnerIds = new Array();
                                var winnerPushTokens = new Array();
                                for (var index in winners){
                                    var winner = winners[index];
                                    winnerIds.push(winner.uid);
                                    winnerPushTokens.push(winner.pushToken);

                                    var newsRef = firebase.database().ref('News').child(winner.uid).push();
                                    var idx = newsRef.key;
                                    var news = {
                                        'idx' : idx,
                                        'title': 'Congratulations!',
                                        'content': 'You won the ' + title +'!',
                                        'relatedId': key,
                                        'isRead' : false,
                                        'newsType' : 0,
                                        'createdAt' : currentTime * 1,
                                        'updatedAt' : currentTime * 1
                                    };
                                    newsRef.set(news, function(error){
                                        if (error) {
                                            console.log('News', error);
                                        }
                                    });

                                    var prize = {
                                        'winnerId'     : winner.uid,
                                        'winnerPhone'  : winner.phone,
                                        'idx'          : key,
                                        'title'        : title,
                                        'description'  : description,
                                        'imageLink'    : imageLink,
                                        'isDelivered'  : false,
                                        'createdAt'    : currentTime * 1,
                                        'updatedAt'    : currentTime * 1
                                    }
                                    var prizesRef = firebase.database().ref('Prizes').child(winner.uid).child(key);
                                    prizesRef.set(prize, function(error){
                                        if(error){
                                            console.log('Prizes', error);
                                        }
                                    });
                                }

                                var loserIds = new Array();
                                var loserPushTokens = new Array();
                                for (var index in losers) {
                                    var loser = losers[index];
                                    loserIds.push(loser.uid);
                                    loserPushTokens.push(loser.pushToken);

                                    var newsRef = firebase.database().ref('News').child(loser.uid).push();
                                    var idx = newsRef.key;
                                    var news = {
                                        'idx' : idx, 
                                        'title': 'We are sorry',
                                        'content': 'You did not win the '+ title +'. Keep chatting so you have a greater chance of winning.',
                                        'relatedId': key,
                                        'isRead' : false,
                                        'newsType' : 0,
                                        'createdAt' : currentTime * 1,
                                        'updatedAt' : currentTime * 1
                                    };
                                    newsRef.set(news, function(error){
                                        if (error) {
                                            console.log('News', error);
                                        }
                                    });
                                }

                                // update raffle data for winners
                                firebase.database().ref('Raffles').child(key).child('winners').set(winnerIds);
                                // send push notification for winners/losers
                                console.log('winnerPushTokens', winnerPushTokens);
                                sendPushNotification('Congratulations! You won the ' + title +'!', winnerPushTokens);
                                console.log('loserPushTokens', loserPushTokens);
                                sendPushNotification('Sorry. You did not win the '+ title +'. Keep chatting so you have a greater chance of winning.', loserPushTokens);
                            }
                        });
                    
                        // make raffle as expired
                        // firebase.database().ref('Raffles').child(key).child('isClosed').set(true);
                    }

                });
            }
        });
    }

    this.start = () => {
        var self = this;
        self.initSassMiddleWare();
        self.init();
        self.initErrorHandler();
        self.doBackgroundJob();
    };
};

authCheck = (req, res, next) => {
    if (req.session.user || req.path=="/signin" || req.path=="/signup") {
        next();     
    } else {
        res.redirect("/signin");
    }
}

Raffler.startInstance = () => {
    var Configuration = require('./config.js');
    var config = Configuration.load();
    var raffler = new Raffler(config);
    raffler.start();
    return raffler;
}

Raffler.startInstance();

module.exports = {app: app, server: server};
