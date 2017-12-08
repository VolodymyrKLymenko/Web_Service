const express = require('express');
var app = express();
var session = session = require('express-session');
const router = express.Router();
var cookieParser = require('cookie-parser');
const pg = require('pg');
const path = require('path');


var connectionString = "postgres://postgres:pokerworld@localhost:5432/ComplexTask";
var pgClient = new pg.Client(connectionString);

app.set('view engine', 'ejs');
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true,
	
}));

app.get('/', function(req,res){
	req.session.store = [];
	res.render('index.ejs', {});
});

app.get('/load', function(req,res){
	res.render('load.ejs',{user:req.session.user, admin:req.session.admin});
	
});


app.get('/profile', function(req,res){

		res.render('profile.ejs', {});

});

app.get('/result', function(req,res){
	if(req.session.user)
	{
		res.render('result.ejs', {});
	}
	else
	{
		res.render('nonRegist.ejs', {err_mess:"You must be logged in",user:req.session.user, admin:req.session.admin});
	}
});

app.post('/login', function (req, res) {
});

app.get('/login', function(req, res){
	req.session.destroy();
	res.render('login.ejs', {user : null, message: null, admin:false});
});
 

app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});

app.post('/signup', function (req, res) {
});

app.get('/admin', function(req,res){
	if(req.session.admin)
	{
		res.render('admin.ejs', {});
	}

	else
	{
		res.render('nonRegist.ejs', {err_mess:"Bad data of registration"});
	}
});


app.get('/performance', function(req,res){
	if(req.session.admin)
	{
		res.render('performance.ejs', {});
	}

	else
	{
		res.render('nonRegist.ejs', {err_mess:"Permision denied"});
	}
});


module.exports = app;