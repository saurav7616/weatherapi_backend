import fetch from 'node-fetch';

const handleCurrent = (req, res, db, api)=>{
  const city = req.query.city;
  const tabData={};
  let resp_cols=[];
  db.select('*').from('information_schema.columns')
  .where('table_name','=','current')
  .orderBy('ordinal_position')
  .then(async(cols)=> {
    const resp = await fetch(`${api.url}?key=${api.api_key}&q=${city}&aqi=no`)
    const data = await resp.json()
    resp_cols = Object.keys(data.location).filter(ele => ele!='localtime_epoch')
    cols.map((ele,index) => Object.assign(tabData, {[ele.column_name] : data.location[resp_cols[index]]}))
    db.insert(tabData).into('current')
    .returning('*')
    .then(record => res.json(record[0]))
    .catch(err => res.json(err.detail))
    db('current').del()
    .then(_ => console.log("emptying table"))
    .catch(err => console.log(err));
  })
}

export default handleCurrent;