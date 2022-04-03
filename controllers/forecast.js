import fetch from 'node-fetch';

const handleForecast = (req, res, db, api)=>{

  const city = req.query.city;                      //getting query param city
  const tabData={};                                 //to store data in table
  let resp_cols=[];                                 //to store keys of api response

  db.select('*').from('information_schema.columns')
  .where('table_name','=','forecast')
  .orderBy('ordinal_position')
  .then(async(cols)=> {

     //fetching forecast api
    const resp = await fetch(`${api.url}?key=${api.api_key}&q=${city}&days=1&aqi=no&alerts=no`)
    const data = await resp.json()
    resp_cols = Object.keys(data.forecast.forecastday[0].astro)

    //storing data from api to insert into table
    cols.map((ele,index) => Object.assign(tabData, {[ele.column_name] : data.forecast.forecastday[0].astro[resp_cols[index]]}))
    
    //inserting into table
    db.insert(tabData).into('forecast')
    .returning('*')
    .then(record => res.json(record[0]))
    .catch(err => res.json(err.detail))

    //emptying table after sending response
    db('forecast').del()
    .then(_ => console.log("emptying table"))
    .catch(err => console.log(err));
  })
}

export default handleForecast;