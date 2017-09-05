const db = require('./db');
const {hashPassword,checkPassword} = require('./hashing')

module.exports.createUser = function({first,last,email,password}){
  return hashPassword(password)
  .then(function(hash){
    const query = 'INSERT INTO users (first,last,email,password) VALUES ($1,$2,$3,$4)'
    return db.query(query,[first,last,email,hash])
  })
}
