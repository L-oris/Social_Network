const express = require('express');
const app = express();
const compression = require('compression');

if(process.env.NODE_ENV != 'production'){
  app.use(require('./build'));
}

app.use(compression());

app.use(express.static('./public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.listen(8080, function() {
    console.log("I'm listening.")
});
