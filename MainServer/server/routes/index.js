const express = require('express');
var app = express();
var session = session = require('express-session');
const router = express.Router();
var cookieParser = require('cookie-parser');
const pg = require('pg');
const path = require('path');
var open = require('open');


var connectionString = "postgres://postgres:pokerworld@localhost:5432/ComplexTask";

app.set('view engine', 'ejs');
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true,
	
}));

app.get('/', function(req,res){
	res.render('index.ejs', {user:req.session.user, surname:req.session.surname});
});
app.get('/load',    function(req,res){

	pg.connect(connectionString, (err, client, done) => {
		if(err)
		{
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}

		var tasks_data = { tasks_id: [], datas: [], servers_id: [], times: [], results: [] };
		var count = 0;

		if(req.session.user_id)
		{
			const query_3 = client.query("SELECT * FROM tasks WHERE result = 'none' AND user_id = " + req.session.user_id +";");			
			query_3.on('row', (row) => {
				tasks_data.tasks_id.push(row.task_id);
				tasks_data.datas.push(row.data);
				tasks_data.servers_id.push(row.server_id);
				tasks_data.times.push(row.time);
				tasks_data.results.push(row.result);
			});

			query_3.on('end', () => {
				done();

				res.render('load.ejs',{user:req.session.user, admin:req.session.admin, data_:tasks_data});
			});
		}
		else
		{
			res.render('load.ejs',{user:req.session.user, admin:req.session.admin});
		}

	});
});
app.get('/login',   function(req,res) {
	req.session.destroy();
	res.render('login');
})
app.post('/log_in', function (req, res) {
	var exist = false;

	var pas1 = req.body.password;
	var login = req.body.username;
		
		pg.connect(connectionString, (err, client, done) => {
			if(err) {
				done();
				console.log(err);
				return res.status(500).json({success: false, data: err});
			}
			const query = client.query('SELECT * FROM users where name=($1)', [req.body.username]);

			query.on('row', (row) => {
				if(row.password == req.body.password)
				{
					exist = true;
					req.session.user    = row.name;
					req.session.surname = row.surname;
					req.session.admin   = row.is_admin;
					req.session.user_id = row.user_id;
				}
			});
				
			query.on('end', () => {
				done();
				if(exist)
				{
					res.render('index', {user: req.session.user, surname: req.session.surname});
				}
				else
				{
					req.session.destroy();
					res.render('login');
				}
			});
		});
});
app.post('/regist', function (req, res) {
	var auth = false;


	if (!req.body.user_name || !req.body.password || !req.body.user_surname) {
		console.log("error");
		res.render('login');
	}
	else if (req.body.password != req.body.password_repeat){
				console.log("error");
		res.render('login');
	}
	else 
	{
		pg.connect(connectionString, (err, client, done) => {

			if(err) {
		  		done();
		  		console.log(err);
		  		return res.status(500).json({success: false, data: err});
			}

			const query = client.query('INSERT INTO users(name, surname, password, is_admin) VALUES(($1), ($2), ($3), ($4));', [req.body.user_name ,req.body.user_surname, req.body.password, false]);

			query.on('end', () => {
		 		done();

		 		var exist = false;

				const query = client.query('SELECT * FROM users where name=($1)', [req.body.user_name]);

				query.on('row', (row) => {
					if(row.password == req.body.password)
					{
						exist = true;
						req.session.user = row.name;
						req.session.surname = row.surname;
						req.session.admin = row.is_admin;
						req.session.user_id = row.user_id;
					}
				});
					
				query.on('end', () => {
					done();
					if(exist)
					{
						res.render('index', {user: req.session.user, surname: req.session.surname});
					}
					else
					{
						req.session.destroy();
						res.render('login');
					}
				});
			});
		});	
	} 
});
app.post('/add', function(req, res){
	var num = (req.body.number);
	var ser1_nonexecuted = 0;
	var ser2_nonexecuted = 0;

	if(num > 999999)
	{
		console.log("Too large number");
		res.render('badNumber.ejs',{user:req.session.user, admin:req.session.admin, reason:"It`s too large number !"});
	}
	else if(num < 0)
	{
		console.log("Negative number");
		res.render('badNumber.ejs',{user:req.session.user, admin:req.session.admin, reason:"It`s negative number !"});
	}
	else
	{
	pg.connect(connectionString, (err, client, done) => {
		if(err)
		{
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}

		const query = client.query("SELECT * FROM servers;");			
		query.on('row', (row) => {
			if(row.server_id == 1)
			{
				ser1_nonexecuted = (0 + row.count_non_executed);
			}
			else if(row.server_id == 2)
			{
				ser2_nonexecuted = (0 + row.count_non_executed);
			}
		});
		query.on('end', () => {
			done();

			var tasks_data = { tasks_id: [], datas: [], servers_id: [], times: [], results: [] };

			if(ser1_nonexecuted > ser2_nonexecuted && req.session.user_id)
			{
				const query_1 = client.query("INSERT INTO tasks(data, server_id, result, user_id, time) VALUES(" + num + ", 2, 'none'," + req.session.user_id + ", 0);");			
				query_1.on('end', () => {
					done();

					const query_2 = client.query("SELECT * FROM tasks WHERE result = 'none' AND user_id = " + req.session.user_id +";");			
					query_2.on('row', (row) => {
						tasks_data.tasks_id.push(row.task_id);
						tasks_data.datas.push(row.data);
						tasks_data.servers_id.push(row.server_id);
						tasks_data.times.push(row.time);
						tasks_data.results.push(row.result);
					});

					query_2.on('end', () => {
						done();

						var new_ = (0 + ser2_nonexecuted + parseInt(num));
						const query_3 = client.query("UPDATE servers SET count_non_executed = " + new_ + " WHERE server_id = 2;");
						query_3.on('end', () => {
							done();
							res.render('load.ejs',{user:req.session.user, admin:req.session.admin, data_:tasks_data});
						});
					});
				});
			}
			else if(ser1_nonexecuted <= ser2_nonexecuted && req.session.user_id)
			{
				const query_1 = client.query("INSERT INTO tasks(data, server_id, result, user_id, time) VALUES(" + num + ", 1, 'none'," + req.session.user_id + ", 0);");			
				query_1.on('end', () => {
					done();

					const query_2 = client.query("SELECT * FROM tasks WHERE result = 'none' AND  user_id = " + req.session.user_id +";");			
					query_2.on('row', (row) => {
						tasks_data.tasks_id.push(row.task_id);
						tasks_data.datas.push(row.data);
						tasks_data.servers_id.push(row.server_id);
						tasks_data.times.push(row.time);
						tasks_data.results.push(row.result);
					});

					query_2.on('end', () => {
						done();

						var new_ = (ser1_nonexecuted + parseInt(num));
						const query_3 = client.query("UPDATE servers SET count_non_executed = " + new_ + " WHERE server_id = 1;");
						query_3.on('end', () => {
							done();
							res.render('load.ejs',{user:req.session.user, admin:req.session.admin, data_:tasks_data});
						});
					});
				});
			}
			else
			{
				res.render('load.ejs',{user:req.session.user, admin:req.session.admin});
			}
		});
	});
	}
});
app.get('/profile', function(req,res){


	pg.connect(connectionString, (err, client, done) => {
		if(err)
		{
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}

		var tasks_data = { tasks_id: [], datas: [], servers_id: [], times: [], results: [] };
		var count = 0;

		if(req.session.user_id)
		{
			const query_3 = client.query("SELECT * FROM tasks WHERE NOT(result = 'none') AND user_id = " + req.session.user_id +";");			
			query_3.on('row', (row) => {
				tasks_data.tasks_id.push(row.task_id);
				tasks_data.datas.push(row.data);
				tasks_data.servers_id.push(row.server_id);
				tasks_data.times.push(row.time);
				tasks_data.results.push(row.result);
			});

			query_3.on('end', () => {
				done();

				res.render('profile.ejs',{user:req.session.user, admin:req.session.admin, data_:tasks_data});
			});
		}
		else
		{
			res.render('profile.ejs',{user:req.session.user, admin:req.session.admin});
		}

	});
});
app.post('/execute_at', function(req, res){
	var id = req.body.id_;

	pg.connect(connectionString, (err, client, done) => {
		if(err)
		{
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}

		var exist = false;
		var server = -1;
		const query = client.query("SELECT * FROM tasks WHERE task_id = " + id +" ;");
		query.on('row', (row) => {
			exist = true;
			server = row.server_id;
		});
		query.on('end', () => {
			done();

			if(exist)
			{
				var user = req.session.user;

				const query_11 = client.query("DELETE FROM inexecuting WHERE state = 'executed' AND server_id = " + server + " ;");
				query_11.on('end', () => {
					done();
				});

				const query_12 = client.query("UPDATE tasks SET result = 'executing' WHERE task_id = " + id + " ;");
				query_12.on('end', () => {
					done();
				});

				const query_1 = client.query("INSERT INTO inexecuting VALUES(" + id + ", 'executing', " + server + ");");
				query_1.on('end', () => {
					done();

					var exe_tasks = { ser_ids:[], datas:[], task_ids:[], states:[] };
					const query_2 = client.query("SELECT tasks.server_id, tasks.data, tasks.task_id, inexecuting.state FROM inexecuting, tasks WHERE inexecuting.task_id = tasks.task_id AND tasks.user_id = " + req.session.user_id + " ;");
					query_2.on('row', (row) => {

						exe_tasks.ser_ids.push(row.server_id);
						exe_tasks.datas.push(row.data);
						exe_tasks.task_ids.push(row.task_id);
						exe_tasks.states.push(row.state);
					});
					query_2.on('end', () => {
						done();

						if(server == 1){
							open('http://localhost:1338/do/' + id + '/' + req.session.user_id);
						}
						else{
							open('http://localhost:1339/do/' + id + '/' + req.session.user_id);
						}

						res.render('performance.ejs', { user:req.session.user, admin:req.session.admin, data:exe_tasks });
					});
					
				});

			}
			else
			{
				res.send("Doesn`t exist");
			}

		});

	});
});
app.get('/performance', function(req,res){
					
		pg.connect(connectionString, (err, client, done) => {
			if(err)
			{
				done();
				console.log(err);
				return res.status(500).json({success: false, data: err});
			}
					
			var exe_tasks = { ser_ids:[], datas:[], task_ids:[], states:[] };
			const query_2 = client.query("SELECT tasks.server_id, tasks.data, tasks.task_id, inexecuting.state FROM inexecuting, tasks WHERE inexecuting.task_id = tasks.task_id AND tasks.user_id = " + req.session.user_id + " ;");
			query_2.on('row', (row) => {

				exe_tasks.ser_ids.push(row.server_id);
				exe_tasks.datas.push(row.data);
				exe_tasks.task_ids.push(row.task_id);
				exe_tasks.states.push(row.state);
			});
			query_2.on('end', () => {
				done();

				res.render('performance.ejs', { user:req.session.user, admin:req.session.admin, data:exe_tasks });
			});
		});
});



/*
app.post('/execute_all', function(req, res){
});*/

module.exports = app;