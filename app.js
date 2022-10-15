require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var userRouter = require('./routes/user');

const mongoose = require('mongoose');
const hbs = require('express-handlebars')
const session = require('express-session')
const adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/', partialsDir: __dirname + '/views/partials',
helpers:{
  eq:(v1,v2)=>{
    return v1===v2;
  },
  gt:(v1,v2)=>{
    return v1>v2;
  },
  ne:(v1,v2)=>{
    return v1!==v2;
  },
  lt:(v1,v2)=>{
    return v1<v2;
  },
  lte:(v1,v2)=>{
    return v1<=v2;
  },
  gte:(v1,v2)=>{
    return v1>=v2;
  },
  and:(v1,v2)=>{
    return v1&&v2;
  },
  or:(v1,v2)=>{
    return v1||v2;
  },
  format:(date)=>{
    newdate=date.toUTCString()
    return newdate.slice(0,16)
  },

  subTotal:(price,quantity)=>{
    return price*quantity
  },  
  count:(n)=>{
    return n+1
  }

} }))




//.................session..............//

app.use(session({ secret: "key", resave: true, saveUninitialized: true, cookie: { maxAge: 60000000000000 } }))
app.use(function (req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRouter);
app.use('/admin', adminRouter);







// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
