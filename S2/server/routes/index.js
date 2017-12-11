const express = require('express');
const pg = require('pg');
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');


const connectionString = "postgres://postgres:pokerworld@localhost:5432/ComplexTask";

var app = express();
app.use(bodyParser.json());

/*
app.get('/do/:user_id', function (req,res)
{
	var rows = [];
	var is_execut = false;
	var cur_tasks = [];
	var task_id_ = 0;
	var task_res = 'false';
	var count_executed = 0;
	var count_non_executed = 0
	var is_some_task = false;
	var time;


			pg.connect(connectionString, (err, client, done) => {
				if(err)
				{
					done();
					console.log(err);
					return res.status(500).json({success: false, data: err});
				}
					
				const query = client.query("select * from servers where server_id = 2");
				query.on('row', (row) => {
					rows.push(row);
				});
				query.on('end', () => {
					done();

					if(rows[0].is_executing == true)
					{
						is_execut = true;
					}
				});

				if(is_execut == false)
				{
					const query_2 = client.query("UPDATE servers SET is_executing = true WHERE server_id = 2;");
					query_2.on('end', () => {
						done();


						const query_3 = client.query("SELECT tasks.data as d, tasks.task_id as id_, servers.count_executed, servers.count_non_executed FROM servers, tasks WHERE tasks.user_id = " +  req.params.user_id + " AND servers.server_id = tasks.server_id AND tasks.result = 'none'  AND tasks.server_id=2;");
					
						query_3.on('row', (row) => {
							cur_tasks.push(row);
						});
							
						query_3.on('end', () => {
							done();

							if(cur_tasks.length != 0)
							{
								is_some_task = true;

								task_id_ = cur_tasks[0].id_;

								var start_p = new Date();
								task_res = execute(cur_tasks[0].d);
								var end_p = new Date();
								time = (end_p - start_p);

								count_executed = cur_tasks[0].count_executed + 1;
								count_non_executed = cur_tasks[0].count_non_executed - 1;
							


								const query_4 = client.query("UPDATE tasks SET result = " + task_res +" WHERE task_id = " + task_id_ +" ;" );
								query_4.on('end', () => {
									done();
								});
								const query_8 = client.query("UPDATE tasks SET time = " + time +" WHERE task_id = " + task_id_ +" ;" );
								query_8.on('end', () => {
									done();
								});

								const query_5 = client.query("UPDATE servers SET count_executed = " + count_executed +" WHERE server_id = 2;" );
								query_5.on('end', () => {
									done();
								});

								const query_6 = client.query("UPDATE servers SET count_non_executed = " + count_non_executed +" WHERE server_id = 2;" );
								query_6.on('end', () => {
									done();
								});
							}
							else
							{
								res.send("No tasks");
							}


							const query_7 = client.query("UPDATE servers SET is_executing = false WHERE server_id = 2;" );
							query_7.on('end', () => {
								done();
							});
						});

					});
				}
				else
				{
					res.send("server is executin now");
				}

			});				
});*/

app.get('/do/:id/:user_id', function (req, res, next) {
	var rows = [];
	var is_execut = false;
	var cur_tasks = [];
	var task_id_ = 0;
	var task_res = 'false';
	var count_executed = 0;
	var count_non_executed = 0
	var is_some_task = false;
	var time;

	console.log("It`s OK");

			pg.connect(connectionString, (err, client, done) => {
				if(err)
				{
					done();
					console.log(err);
					return res.status(500).json({success: false, data: err});
				}
					
				const query = client.query("select * from servers where server_id = 2");
				query.on('row', (row) => {
					rows.push(row);
				});
				query.on('end', () => {
					done();

					if(rows[0].is_executing == true)
					{
						is_execut = true;
					}
				});

				if(is_execut == false)
				{
					const query_2 = client.query("UPDATE servers SET is_executing = true WHERE server_id = 2;");
					query_2.on('end', () => {
						done();


						const query_3 = client.query("SELECT tasks.data as d, tasks.task_id as id_, servers.count_executed, servers.count_non_executed FROM servers, tasks WHERE tasks.user_id = " +  req.params.user_id + " AND   tasks.task_id = " + req.params.id + " AND servers.server_id = tasks.server_id AND tasks.result = 'executing'  AND tasks.server_id=2;");
					
						query_3.on('row', (row) => {
							cur_tasks.push(row);
						});
							
						query_3.on('end', () => {
							done();

							if(cur_tasks.length != 0)
							{
								is_some_task = true;

								task_id_ = cur_tasks[0].id_;

								var start_p = new Date();
								task_res = execute(cur_tasks[0].d, task_id_);
								var end_p = new Date();
								time = (end_p - start_p);

								count_executed = (cur_tasks[0].count_executed + cur_tasks[0].d);
								count_non_executed = (cur_tasks[0].count_non_executed - cur_tasks[0].d);
							

								const query_4 = client.query("UPDATE tasks SET result = " + task_res +" WHERE task_id = " + task_id_ +" ;" );
								query_4.on('end', () => {
									done();
								});
								const query_8 = client.query("UPDATE tasks SET time = " + time +" WHERE task_id = " + task_id_ +" ;" );
								query_8.on('end', () => {
									done();
								});

								const query_5 = client.query("UPDATE servers SET count_executed = " + count_executed +" WHERE server_id = 2;" );
								query_5.on('end', () => {
									done();
								});

								const query_6 = client.query("UPDATE servers SET count_non_executed = " + count_non_executed +" WHERE server_id = 2;" );
								query_6.on('end', () => {
									done();
								});

								const query_9 = client.query("UPDATE inexecuting SET state = 'executed' WHERE task_id = " + task_id_ + " ;")
									query_6.on('end', () => {
									done();
								});
							}
							else
							{
								res.send("No tasks");
							}


							const query_7 = client.query("UPDATE servers SET is_executing = false WHERE server_id = 2;" );
							query_7.on('end', () => {
								done();

								res.send("Done: Result of " + task_id_ + " is " + task_res);
							});
						});

					});
				}
				else
				{
					res.send("server is executin now");
				}

			});				
});

function execute(number, task_id)
{
	var res = true;
	var i = 0.0;
	var percent = 0;

			for (i = 2; i < number; ++i) {
				for(var k = 0; k < 900000; ++k){
					k*k;
				};
				
				if((number % i) == 0)
				{
					res = false;
				}
			}

	return res;
}

module.exports = app;