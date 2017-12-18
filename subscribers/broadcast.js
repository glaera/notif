var webPush = require('web-push');
const Datastore = require('@google-cloud/datastore');
const send = require('./send');

// Instantiates a client
const datastore = Datastore();

function getModel () {
    return require(`./model-datastore`);
  }

var broadcastHandler = function(req,res){
    
  let subscriptionIds = req.body.subscriptionId;
  if (subscriptionIds) {
      if (!Array.isArray(subscriptionIds) ) {
        subscriptionIds = [subscriptionIds];
      }
      let message = req.body.message;
      
      subscriptionIds.forEach(id=>{
        send(id,message);
      });
  
  }


  res.redirect(301, '/static/index.html');

  };

  module.exports = broadcastHandler;