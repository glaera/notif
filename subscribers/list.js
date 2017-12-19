var webPush = require('web-push');
const Datastore = require('@google-cloud/datastore');
var google = require('googleapis');
var plus = google.plus('v1');
var OAuth2 = google.auth.OAuth2;
const config = require('../config');

const ClientId = "110555067693-cmpbcaljgnk6ifiiklpr02fgb1b5feso.apps.googleusercontent.com";
const ClientSecret = "NOSECRET";
const RedirectionUrl = "http://localhost:8080/oauthCallback";


// Instantiates a client
const datastore = Datastore();

function getModel () {
    return require(`./model-datastore`);
}

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

const reducerjson = (accumulator, currentValue) => {
  return accumulator + `<tr>`+ 
  `<td><input type="checkbox" id="cID${currentValue.id}" name="subscriptionId" value="${currentValue.id}"></td>`+
  `<td>${currentValue.id}</td>`+
  `<td><a style="text-decoration: none" href="/api/push/${currentValue.id}">P</a></td>`+
  `<td><a style="text-decoration: none"  href="/api/delete/${currentValue.id}">X </a></td>`+
  `<td><a style="text-decoration: none"  href="/api/read/${currentValue.id}">d </a></td>`+
  `<td>${currentValue.ipaddress} </td>`+
  
  '</tr>';
};

function asHtml (data) {
 
  return '<table>'
  +'<tr><th></th><th>internal id</th><th>push</th><th>delete</th><th>detail</th><th>IP address</th></tr>'
  +data.reduce(reducerjson,'')
  +'</table>';
}


var listHandler = function(req,res){
    var oauth2Client = getOAuthClient();
    oauth2Client.credentials = req.session["tokens"];
/*
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
*/
    getModel().list(10, null, (err, entities, cursor) => {
      if (err) {
        res.end("error");;
        return;
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(asHtml(entities));
      if (false)res.json({
        items: entities,
        nextPageToken: cursor
      });
    });
    
  };

  module.exports = listHandler;
