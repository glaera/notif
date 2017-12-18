var webPush = require('web-push');
const Datastore = require('@google-cloud/datastore');
const send = require('./send');

// Instantiates a client
const datastore = Datastore();

function getModel () {
    return require(`./model-datastore`);
  }

var pushHandler = function(req,res){
  
  send(req.params.internalId,'Hi!');
  /*
  getModel().read(req.params.internalId, (err, entity) => {
    if (err) {
      next(err);
      return;
    }


    try {
      const pushSubscription = entity;

      getModel().create(pushSubscription, (err, entity) => {
        if (err) {
          console.log('gennaro storing subscription',err);
          return;
        }
        console.log('gennaro entity stored',entity);
      });

      // TODO 4.3a - include VAPID keys
      
      var payload = 'Here is a payload!';
      
      var options = {
        gcmAPIKey: 'AAAA4hP27WY:APA91bHDBs-UYMCEmjriFRauvsbI4cHTWzow-pLWAEBjQTOxfKKwO8x7x7NLs_CdiuRr0H1SKX_07pdo8TRhMlTjqVG7eNb7ih9dwzvXPYO4ZzDzC_M9PO_Tka6BnKk68P95PUxgcGPV',
        TTL: 60,
      
        // TODO 4.3b - add VAPID details
      
      };
      
      webPush.sendNotification(
        pushSubscription,
        payload,
        options
      );
    }
    catch(err) {
        console.log('gennaro error',err)
    }
    
    
    //res.end("sent");
  });
    */
    res.redirect(301, '/api/list');
  };

  module.exports = pushHandler;