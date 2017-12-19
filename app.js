/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';



// [START app]
const express = require('express');
var Session = require('express-session');
var webPush = require('web-push');
var path = require('path');
var bodyParser = require('body-parser');
const config = require('./config');

var http = require('http');
var google = require('googleapis');
const passport = require('passport');
var plus = google.plus('v1');
var OAuth2 = google.auth.OAuth2;
const ClientId = "110555067693-cmpbcaljgnk6ifiiklpr02fgb1b5feso.apps.googleusercontent.com";
const ClientSecret = "7bOBZBi67pmSwa9EYW6zqnHg";
const RedirectionUrl = "http://localhost:8080/oauthCallback";


const app = express();


console.log('gennaro is ',config.get('NODE_ENV'))
app.use(Session({
  secret: 'raysources-secret-19890913007',
  resave: true,
  saveUninitialized: true
}));
// OAuth2
app.use(passport.initialize());
app.use(passport.session());

app.disable('etag');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.enable('trust proxy');
app.use("/login", function (req, res) {
  var url = getAuthUrl();
  res.send(`
      <h1>Authentication using google oAuth</h1>
      <a href=${url}>Login</a>
  `)
});

app.get('/', (req, res) => {
  res.redirect(301, '/static/index.html');
});


app.post('/api/send-push-msg',require('./subscribers/subscribe'));
  
app.post('/api/broadcast',require('./subscribers/broadcast'));
app.post('/api/multidelete',require('./subscribers/multidelete'));

app.get('/api/list',require('./subscribers/list'));
app.post('/api/unsubscribe',require('./subscribers/unsubscribe'));

app.get('/api/read/:internalId',require('./subscribers/read'));

app.get('/api/push/:internalId',require('./subscribers/push'));

app.get('/api/delete/:internalId',require('./subscribers/delete'));


app.get('/static/*', (req, res) => {
  let url = req.url.substring('/static'.length);

  res.sendFile(path.join(__dirname + url));
});


function getRedirectUrl () {
  if (config.get('NODE_ENV')==='development') {
    return RedirectionUrl;
  } else {
    return 'https://ai-project-tutorial.appspot.com/oauthCallback';
  }
}
function getOAuthClient () {
  return new OAuth2(ClientId ,  ClientSecret, getRedirectUrl ());
}

function getAuthUrl () {
  var oauth2Client = getOAuthClient();
  // generate a url that asks permissions for Google+ and Google Calendar scopes
  var scopes = [
    'https://www.googleapis.com/auth/plus.me'
  ];

  var url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['email', 'profile'] // If you only need one scope you can pass it as string
  });

  return url;
}

app.use("/oauthCallback", function (req, res) {
  console.log('gennaro in oauthCallback')
  var oauth2Client = getOAuthClient();
  var session = req.session;
  var code = req.query.code;
  oauth2Client.getToken(code, function(err, tokens) {
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    console.log('gennaro in gettoken',err,oauth2Client)
    if(!err) {
      //oauth2Client.setCredentials(tokens);
      oauth2Client.credentials = tokens
      session["tokens"]=tokens;

      console.log('GENNARO Controlla ',session);

      var oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2'
        });

        oauth2.userinfo.v2.me.get(
        function(err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res);
            }
        });

      res.send(`
          <h3>Login successful!!</h3>
          <a href="/static/index.html">Continute going notification page</a>
      `);
    }
    else{
      res.send(`
          <h3>Login failed!!</h3>
      `);
    }
  });
});


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END app]
