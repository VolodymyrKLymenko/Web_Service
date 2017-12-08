const pg = require('pg');

const connectionString = "postgres://postgres:pokerworld@localhost:5432/web_store_data";

const client = new pg.Client(connectionString);
client.connect();

const query = client.query(
  'CREATE TABLE items(' +
  'id SERIAL PRIMARY KEY, ' +
  'text VARCHAR(40) not null, ' +
  'complete BOOLEAN)');

query.on('end', () => { client.end(); });