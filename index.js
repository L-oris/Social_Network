const express = require('express'),
      app = express()

const {middlewares} = require('./express/middlewares')
      RESTfulRouter = require('./express/RESTfulRouter')

if(process.env.NODE_ENV != 'production'){
  app.use(require('./build'))
}

//apply middlewares
middlewares(app)

//serve static files
app.use(express.static('./public'))

//apply RESTful routes
app.use('/',RESTfulRouter)

//REDIRECT USER BASED ON HIS REGISTRATION STATUS
app.get('*', function(req,res){
  if(!req.session.user && req.url !== '/welcome'){
    return res.redirect('/welcome')
  }
  res.sendFile(__dirname + '/index.html')
})

//handle 'Express' errors
app.use(function (err, req, res, next){
  console.log(`Error inside Express Server: ${err}`)
  res.status(500).json({success:false})
})


const port = 8080
app.listen(port, function() {
  console.log(`Server listening on port ${port}`)
})
