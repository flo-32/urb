var express = require('express');
var mongoose = require('mongoose');
var http = require('http');

var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var cookieParser = require('cookie-parser');

var config = require('./config/config'); //static configurations

var multer  = require('multer');
//var storage = multer.memoryStorage();
//var upload = multer({ storage: storage });
var upload = multer({ dest: 'tmp/uploads' }); 

mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl, function(err){
    if(err) {
        console.log(err);
    } else {
        console.log('Connected to DB!');
    }
});

require('./config/passport')(passport); // pass passport for configuration

var cloudinary = require('cloudinary');
cloudinary.config(config.cloudinary);

var app = express();
app.set('port', config.port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public')); //static files
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

// required for passport
//app.use(session({
//    secret: 'ilovescotchscotchyscotchscotch',
//    resave: false,
//    saveUninitialized: true,
//    cookie: {secure: true}
//})); 
app.use(passport.initialize());
//app.use(passport.session());

var api = require('./app/api')(app, express, passport, upload, cloudinary);
app.use('/api', api);

app.use(express.static(__dirname + '/public'));

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

http.createServer(app).listen(app.get('port'), function (err) {
    if(err) {
        console.log(err);
    } else {
      console.log('Express server listening on port ' + app.get('port'));  
    }
});
