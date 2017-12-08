const express = require('express');
var app = express();
var session = session = require('express-session');
const router = express.Router();
var cookieParser = require('cookie-parser');
const pg = require('pg');
const path = require('path');
var connectionString = "postgres://postgres:pokerworld@localhost:5432/web_store_data";
var pgClient = new pg.Client(connectionString);


const exec = require("child_process").exec;

var s = 1;

app.post('/do', function (req,res)
{
	var rows = [];

			pg.connect(connectionString, (err, client, done) => {
				if(err)
				{
					done();
					console.log(err);
					return res.status(500).json({success: false, data: err});
				}
					
				const query = client.query("select * from files where task_id = " + req.task_id);
						
				query.on('row', (row) => {
					rows.push(row);
				});
				query.on('end', () => {
					done();
					var result = execute(rows[0].start_point, rows[0].end_point, rows[0].task);
					//res.redirect(307, 'http://localhost:4000/profile');
					res.send(result)
				});
			});
									
});

function execute(start, end, task_id)
{		
	var result = "";

		pg.connect(connectionString, (err, client, done) => {

			if(err) {
				done();
				console.log(err);
				return res.status(500).json({success: false, data: err});
			}

			for (int i = start; i <= end; ++i) 
			{
				if(isSimple(i) == true)
					result += i;
			};

			const query = client.query("update tasks set res = " + result + " where task_id = " + task_id);

			query.on('end', () => {
				done();
			});
		});

		return result;
}

function isSimple(int num)
{
	var res = true;

	for (var i = 2; i < num; ++i) {
		if(num % i == 0)
		{
			res = false;
			break;
		}
	};

	return res;
}

module.exports = app;