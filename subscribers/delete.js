var webPush = require('web-push');
const Datastore = require('@google-cloud/datastore');

// Instantiates a client
const datastore = Datastore();

function getModel () {
    return require(`./model-datastore`);
  }

var deleteHandler = function(req,res){
    
  getModel().delete(req.params.internalId, (err, entity) => {
    if (err) {
      return;
    }
    //res.json(entity);
    res.redirect(301, '/api/list');
  });
   

  };

  module.exports = deleteHandler;
