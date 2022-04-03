const handleLabelChange = (req, res, db)=>{
  const tab = req.query.tab;
  const { current_label, new_label} = req.body;
  db.raw(`ALTER TABLE ${tab} RENAME COLUMN ${current_label} TO ${new_label}`)
  .then(rec => res.json('Label changed successfully'))
  .catch(err => res.json('Label already exist'))
}

export default handleLabelChange;