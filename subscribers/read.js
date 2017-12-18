var webPush = require('web-push');
const Datastore = require('@google-cloud/datastore');

// Instantiates a client
const datastore = Datastore();

function getModel () {
    return require(`./model-datastore`);
  }

var readHandler = function(req,res){
    
  getModel().read(req.params.internalId, (err, entity) => {
    if (err) {
      console.log('gennaro failed to read',err);
      return;
    }
    res.json(entity);
  });
    
  };

  module.exports = readHandler;