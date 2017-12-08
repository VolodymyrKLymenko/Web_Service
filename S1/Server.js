const express      = require('express');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const path = require('path');

const routes = require('./server/routes/index');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/assets', express.static('assets'));

app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

app.listen(1338, function(){
    console.log('Express server listening on port 1338');
});