'use strict';

var IndexModel = require('../models/index');
//const processMessage = require('../helpers/processMessage');


module.exports = function (router) {

    var model = new IndexModel();

    router.get('/', function (req, res) {
        
        res.send('<code><pre>' + JSON.stringify(model, null, 2) + '</pre></code>');
        
    });

    router.get('/verification', function (req, res){
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
                entry.messaging.forEach(event => {
                if (event.message && event.message.text) {
                      //  processMessage(event);
                    }
                });
            });
                res.status(200).end();
        }
    })

};
