const db = require('./db');

module.exports.createUser = function({first,last,email,password}){
  const query = 'INSERT INTO users (first,last,email,password) VALUES ($1,$2,$3,$4)'
  return db.query(query,[first,last,email,password])
}
