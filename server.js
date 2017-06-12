var express = require('express');
var path = require('path');
var sassMiddleware = require('node-sass-middleware');
var url = require('url');
var request = require('request');

var portToUse = process.env.PORT || 8080;
var googleAPIKey = process.env.GOOGLE_MAPS_API || require('./keys.js').mapsKey;

var app = express();
app.use(sassMiddleware(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'views')));

// overcome CORS by setting Access-Control-Allow-Origin header
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/one/*', function(req,res) {
    
    var postCodeStr = req.url.substring('/one/'.length);
    
     var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + postCodeStr + "&key=" + googleAPIKey;
        request({
            url: url,
            json: true
        }, function (error, response, body) {
            // if we got a location ...
            if (!error && response.statusCode === 200) {
                // get the location (lat & lng)
                var latLong = body.results[0].geometry.location;
                // and return it (this COULD be empty)
                res.end(JSON.stringify(latLong));
            } else {
                // we hit an error of some type
                res.end(null);
            }
        });

});


app.listen(portToUse, function() {
    console.log("Server started, listening on port", portToUse);
});