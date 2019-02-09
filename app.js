var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
//to manage login signup sessions
var passport=require('passport');
var bodyParser=require('body-parser');
var validator=require('express-validator');


//to attatch some messages to the client requests and they get deleted from the session once 
//their work gets over
var flash=require('connect-flash');
var userRouter = require('./routes/user');
var indexRouter = require('./routes/index');

var express = require('express');
var session = require('express-session');
var MongoStore= require('connect-mongo')(session);

var app = express();
var mongoose =require('mongoose');
mongoose.connect('mongodb://localhost/shopping');
require('./config/passport');

//define the connection 
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

//open the connection
db.once('open', function() {
  console.log("connected");
});
productModel=require('./models/product');


var app = express();



// view engine setup
//set the view engine to hbs
app.engine('.hbs',expressHbs({defaultLayout: 'layout',extname: '.hbs'})); //configure the templating engine by passing the javascript object


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');


app.use(logger('dev'));
app.use(express.json());
//app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session(
  {
    secret:'mysecret',
    resave:false,
    saveUninitialized:false,
    store: new MongoStore({mongooseConnection:mongoose.connection}),//use the old mongoose connection instead of creating new one
    cookie:{maxAge:180*60*1000}
  }));//enables session and configuration
app.use(flash()); //initialized after session as flash uses session
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

//here order of the router matters ..if the indexrouter is 
//above the indexRouter then the requests wont reach out to the the user router
app.use('/user',userRouter);
app.use('/', indexRouter);






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  //set locals for session to use in the templates
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.session=req.session;
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
