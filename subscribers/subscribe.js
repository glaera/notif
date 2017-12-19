var webPush = require('web-push');
const Datastore = require('@google-cloud/datastore');

// Instantiates a client
const datastore = Datastore();

function getModel () {
    return require(`./model-datastore`);
  }

var subscribeHandler = function(req,res){
    let subscription = req.query.subscription;
    


    console.log('gennaro received ',req.query,req.connection.remoteAddress)
    
    try {
      const pushSubscription = {
          endpoint: req.query.endpoint,
          keys: {
              p256dh: req.query.p256dh,
              auth: req.query.auth
          },
          ipaddress:req.connection.remoteAddress
      }

      getModel().create(pushSubscription, (err, entity) => {
        if (err) {
          console.log(' storing subscription',err);
          return;
        }
        console.log(' entity stored',entity);
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
  
    res.end("ok");
  };

  module.exports = subscribeHandler;
