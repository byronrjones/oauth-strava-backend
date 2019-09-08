let express = require('express')
let request = require('request')
let querystring = require('querystring')

let app = express()

let redirect_uri = 
  process.env.REDIRECT_URI || 
  'http://localhost:8888/callback'

app.get('/login', function(req, res) {
  res.redirect('https://www.strava.com/oauth/authorize?' +
    querystring.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      redirect_uri,
      response_type: 'code',
      approval_prompt: 'auto',
      scope: 'read,activity:read_all,profile:read_all,read_all',
      
    }))

    console.log('login-request-body ->',res)
})

app.get('/callback', function(req, res) {
  let code = req.query.code || null
  let scope = req.query.scope
  //console.log('client ID->',process.env.STRAVA_CLIENT_ID);
  //console.log('client Secret->',process.env.STRAVA_CLIENT_SECRET);
  let authOptions = {
    url: 'https://www.strava.com/oauth/token?',
    form: {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code: code,
      // redirect_uri,
      grant_type: 'authorization_code'
    },
    // headers: {
    //   'Authorization': 'Basic ' + (new Buffer(
    //     process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
    //   ).toString('base64'))
    // },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
    res.redirect(uri + '?access_token=' + access_token)
    console.log('get token-response ->',body)
  })
})

let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)