var webPush = require('web-push');
const Datastore = require('@google-cloud/datastore');
const removeSubscription = require('./removeSubscription');

// Instantiates a client
const datastore = Datastore();

function getModel () {
    return require(`./model-datastore`);
  }

var multideleteHandler = function(req,res){
    
  let subscriptionIds = req.body.subscriptionId;
  

  subscriptionIds.forEach(id=>{
    removeSubscription(id);
  });

  res.redirect(301, '/static/index.html');

  };

  module.exports = multideleteHandler;