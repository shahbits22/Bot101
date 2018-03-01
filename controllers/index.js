'use strict';

//var IndexModel = require('../models/index');
//const MessageHelper = require('../helpers/messageHelper');
import * as MessageHelper from '../helpers/messageHelper';

module.exports = function (router) {

    
    // router.get('/', function (req, res) {
        
    //     res.send('<code><pre>' + JSON.stringify(model, null, 2) + '</pre></code>');
        
    // });

    router.get('/webhook', function (req, res){
        const hubChallenge = req.query['hub.challenge'];
        const hubMode = req.query['hub.mode'];
         const verifyTokenMatches = (req.query['hub.verify_token'] === 'contento');
        if (hubMode && verifyTokenMatches) {
         res.status(200).send(hubChallenge);
         } else {
         res.status(403).end();
         }
    });

    router.post('/webhook', function (req, res){
        if (req.body.object === 'page') {
            req.body.entry.forEach(entry => {

                // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message && webhook_event.message.text) {
               // handleMessage(sender_psid, webhook_event.message); 
                MessageHelper.processMessage(webhook_event);       
            } else if (webhook_event.postback) {
                MessageHelper.handlePostback(sender_psid, webhook_event.postback);
            }
            
            /*entry.messaging.forEach(event => {
            if (event.message && event.message.text) {
                    MessageHelper.processMessage(event);
                }
            });*/
        });
                res.status(200).end();
        }
    });

    router.get('/getStarted', function (req, res){
        MessageHelper.setupGetStarted();
        res.status(200).end();
    });

};
