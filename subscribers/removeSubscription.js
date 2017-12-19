var webPush = require('web-push');
const Datastore = require('@google-cloud/datastore');

// Instantiates a client
const datastore = Datastore();

function getModel () {
    return require(`./model-datastore`);
  }


var removeSubscription = function(id,message){
    
  getModel().delete(id, (err, entity) => {
    if (err) {
      console.log(' failed to delete',err);
    } 
  });
    
  };

  module.exports = removeSubscription;
