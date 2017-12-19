var webPush = require('web-push');
const Datastore = require('@google-cloud/datastore');

// Instantiates a client
const datastore = Datastore();

function getModel () {
    return require(`./model-datastore`);
  }

var unsubscribeHandler = function(req,res){
    let ipaddress = req.connection.remoteAddress;
    getModel().deleteByIP(ipaddress, (err, entity) => {
      if (err) {
        console.log('gennaro failed to delete',err);
        return;
      }
      //res.json(entity);
      res.redirect(301, '/api/list');
    });
     

  
  };

  module.exports = unsubscribeHandler;
