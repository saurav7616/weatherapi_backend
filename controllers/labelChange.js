const handleLabelChange = (req, res, db)=>{

  const tab = req.query.tab;      //getting query param tab(current, forecast)

  const { current_label, new_label} = req.body;     //req body containing old and new labels to update

  //updating label
  db.raw(`ALTER TABLE ${tab} RENAME COLUMN ${current_label} TO ${new_label}`)
  .then(_ => res.json('Label changed successfully'))
  .catch(_ => res.json('Label already exist'))
}

export default handleLabelChange;