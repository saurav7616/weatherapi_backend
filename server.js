import express from 'express';
import pkg from 'body-parser';
import cors from 'cors';
import knex from 'knex';

import handleCurrent from './controllers/current.js';
import handleForecast from './controllers/forecast.js';
import handleLabelChange from './controllers/labelChange.js';

const {json} = pkg;

// database info
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
  }
});


const app = express();
let capi;   //storing current api
let fapi;   //storing forecast api

app.use(json());
app.use(cors());	
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // handle OPTIONS method
  if ('OPTIONS' == req.method) {
      return res.sendStatus(200);
  } else {
      next();
  }
});


//getting api attributes(url, key, tab)
db.select('*')
  .from('api_attr')
  .then(list => {
    list.map(api => api.tab==="current"? capi={...api} : fapi={...api})
});

app.get('/', (req,res) => { res.json('working') })                              //base endpoint
app.get('/current', (req, res)=>{ handleCurrent(req, res, db, capi)})           //forecast endpoint
app.get('/forecast', (req,res)=>{ handleForecast(req, res, db, fapi)})          //current endpoint
app.post('/labelchange', (req,res)=>{ handleLabelChange(req, res, db)})         //label change endpoint

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log(`runnning fine on port ${PORT}`);
})