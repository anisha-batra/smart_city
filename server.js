var express = require('express');
var app = express();
var path = require('path');
var timeseries = require("timeseries-analysis");

//support parsing of application/json type post data
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// Database Connection Settings
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/smart_city';

if (process.argv.length > 2 && process.argv[2] === "production") {
    console.log('Using AWS Settings for MongoDB Connection')
    url = 'mongodb://awsuser:demo123@localhost:27017/smart_city';
}

// ------------------------------------------------------------------
// WEB SERVICE - ADD INTERSECTION
//               (Add Information About An Intersection)
//               Unique Key : Intersection Name
// ------------------------------------------------------------------
app.post('/addIntersection', function (req, res) {
    console.log('Executing Web Service: Add Intersection');

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var record = {
        "intersectionName": req.body.name,
        "latitude": req.body.latitude,
        "longitude": req.body.longitude
    };

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('intersections').insertOne(record, function (err, result) {
            assert.equal(err, null);
            console.log("- Added Intersection: " + record);
            res.send({});
        });
    });
});

// ------------------------------------------------------------------
// WEB SERVICE - GET ALL INTERSECTIONS
// ------------------------------------------------------------------
app.get('/getAllIntersections', function (req, res) {
    console.log('Executing Web Service: Get All Intersections');

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('intersections').find({}).toArray(function (err, arrayOfDocs) {
            assert.equal(err, null);
            //console.log("- All Intersections: " + arrayOfDocs);
            console.log("- All Intersections, Records Count: " + arrayOfDocs.length);

            res.setHeader('Content-Type', 'application/json');
            res.json(arrayOfDocs);
        });
    });
});

// ------------------------------------------------------------------
// WEB SERVICE - GET INTERSECTION BY NAME
// ------------------------------------------------------------------
app.get('/getIntersectionByName/:intersectionName', function (req, res) {
    console.log('Executing Web Service: Get Intersection By Name');

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var intersectionName = req.params.intersectionName;

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('intersections').findOne({ 'intersectionName': intersectionName }, function (err, doc) {
            assert.equal(err, null);
            console.log("- Intersection Having Name = " + intersectionName + ": " + doc);

            res.setHeader('Content-Type', 'application/json');
            res.json(doc);
        });
    });
});

// ------------------------------------------------------------------
// WEB SERVICE - RECORD CAR/PEDESTRIAN DETECTION
//               Foreign Key : Intersection Name
// ------------------------------------------------------------------
app.post('/addDetectedTraffic', function (req, res) {

    console.log('Executing Web Service: Add Detected Traffic');

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var intersectionName = req.body.intersectionName;
    var detectedTrafficType = req.body.detectedTrafficType;
    var detectedOn = req.body.detectionTimeStamp;

    var record = {
        "intersectionName": req.body.intersectionName,
        "detectedOn": req.body.detectedOn,
        "carQuantity": req.body.carQuantity,
        "peopleQuantity": req.body.peopleQuantity
    };

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('intersection_traffic').insertOne(record, function (err, result) {
            assert.equal(err, null);
            console.log("- Added Detection: " + record);
            res.send({});
        });
    });

});

// ------------------------------------------------------------------
// WEB SERVICE - GET ALL TRAFFIC DETECTIONS
// ------------------------------------------------------------------
app.get('/getAllTrafficDetections', function (req, res) {
    console.log('Executing Web Service: Get All Detections');

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('intersection_traffic').find({}).toArray(function (err, arrayOfDocs) {
            assert.equal(err, null);
            //console.log("- All Detecttion: " + arrayOfDocs);
            console.log("- All Traffic Detections, Records Count: " + arrayOfDocs.length);

            res.setHeader('Content-Type', 'application/json');
            res.json(arrayOfDocs);
        });
    });
});

// // ------------------------------------------------------------------
// // WEB SERVICE - GET ALL DETECTIONS OF TRAFFIC TYPE
// // ------------------------------------------------------------------
// app.get('/getAllDetectionsOfType/:trafficType', function (req, res) {
//     console.log('Executing Web Service: Get All Detections Of Type');

//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

//     var trafficType = req.params.trafficType;

//     MongoClient.connect(url, function (err, db) {
//         assert.equal(null, err);
//         db.collection('intersection_traffic').find({ 'detectedTrafficType': trafficType }).toArray(function (err, arrayOfDocs) {
//             assert.equal(err, null);
//             console.log("- All Detection Of Type = " + trafficType + ": " + arrayOfDocs);

//             res.setHeader('Content-Type', 'application/json');
//             res.json(arrayOfDocs);
//         });
//     });
// });

// ------------------------------------------------------------------
// WEB SERVICE - GET ALL DETECTIONS AT SPECIFIED INTERSECTION
// ------------------------------------------------------------------
app.get('/getAllDetectionsAtIntersection/:intersectionName', function (req, res) {
    console.log('Executing Web Service: Get All Detections At Intersection');

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var intersectionName = req.params.intersectionName;

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('intersection_traffic').find({ 'intersectionName': intersectionName }).toArray(function (err, arrayOfDocs) {
            assert.equal(err, null);
            //console.log("- All Traffic Detections At Intersection = " + intersectionName + ": " + arrayOfDocs);
            console.log("- All Traffic Detections At Intersection = " + intersectionName + ", Records Count: " + arrayOfDocs.length);

            res.setHeader('Content-Type', 'application/json');
            res.json(arrayOfDocs);
        });
    });
});

// // ------------------------------------------------------------------
// // WEB SERVICE - GET ALL DETECTIONS OF TYPE AT INTERSECTION
// // ------------------------------------------------------------------
// app.get('/getAllDetectionsOfTypeAtIntersection/:trafficType/:intersectionName', function (req, res) {
//     console.log('Executing Web Service: Get All Detections At Intersection');

//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

//     var trafficType = req.params.trafficType;
//     var intersectionName = req.params.intersectionName;

//     MongoClient.connect(url, function (err, db) {
//         assert.equal(null, err);
//         db.collection('intersection_traffic').find({ 'detectedTrafficType': trafficType, 'intersectionName': intersectionName }).toArray(function (err, arrayOfDocs) {
//             assert.equal(err, null);
//             console.log("- All Detections Of Type = " + trafficType + " At Intersection = " + intersectionName + ": " + arrayOfDocs);

//             res.setHeader('Content-Type', 'application/json');
//             res.json(arrayOfDocs);
//         });
//     });
// });

// ------------------------------------------------------------------
// WEB SERVICE - FORECAST
// ------------------------------------------------------------------
app.get('/forecast/:intersectionName', function (req, res) {
    console.log('Executing Web Service: Get Forecast');

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var searchFilters = {};

    var intersectionName = req.params.intersectionName;
    if (intersectionName != 'all') {
        searchFilters['intersectionName'] = intersectionName;
    }

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('intersection_traffic').find(searchFilters).toArray(function (err, arrayOfDocs) {
            assert.equal(err, null);
            //console.log("- All Detecttion: " + arrayOfDocs);
            console.log("- All Traffic Detections At Intersection = " + intersectionName + ", Records Count: " + arrayOfDocs.length);

            var taCars = new timeseries.main(timeseries.adapter.fromDB(arrayOfDocs, {
                date: 'detectedOn',     // Name of the property containing the Date (must be compatible with new Date(date) )
                value: 'carQuantity'     // Name of the property containign the value. here we'll use the "close" price.
            }));
            var taPeople = new timeseries.main(timeseries.adapter.fromDB(arrayOfDocs, {
                date: 'detectedOn',     // Name of the property containing the Date (must be compatible with new Date(date) )
                value: 'peopleQuantity'     // Name of the property containign the value. here we'll use the "close" price.
            }));

            // Now we remove the noise from the data and save that noiseless data so we can display it on the chart
            taCars.smoother({ period: 4 }).save('smoothed');
            taPeople.smoother({ period: 4 }).save('smoothed');

            // Find the best settings for the forecasting:
            var bestSettingsCars = taCars.regression_forecast_optimize(); // returns { MSE: 0.05086675645862624, method: 'ARMaxEntropy', degree: 4, sample: 20 }
            // var bestSettingsPeople = taPeople.regression_forecast_optimize(); // returns { MSE: 0.05086675645862624, method: 'ARMaxEntropy', degree: 4, sample: 20 }

            // Apply those settings to forecast the n+1 value
            taCars.sliding_regression_forecast({
                sample: bestSettingsCars.sample,
                degree: bestSettingsCars.degree,
                method: bestSettingsCars.method
            });
            console.log(JSON.stringify(bestSettingsCars));

            // // Apply those settings to forecast the n+1 value
            // taPeople.sliding_regression_forecast({
            //     sample: bestSettingsPeople.sample,
            //     degree: bestSettingsPeople.degree,
            //     method: bestSettingsPeople.method
            // });

            var sampleSize = Math.floor(arrayOfDocs.length * 0.75);

            // We are going to use the past 20 datapoints to predict the n+1 value, with an AR degree of 5 (default)
            // The default method used is Max Entropy
            //taCars.sliding_regression_forecast({ sample: sampleSize, degree: 5, method: 'ARLeastSquare' });
            taPeople.sliding_regression_forecast({ sample: sampleSize, degree: 5, method: 'ARLeastSquare' });

            // Now we chart the results, comparing the the original data.
            // Since we are using the past 20 datapoints to predict the next one, the forecasting only start at datapoint #21. To show that on the chart, we are displaying a red dot at the #21st datapoint:
            // var chart_url = taCars.chart({ main: true, points: [{ color: 'ff0000', point: 21, serie: 0 }] });

            //console.log(JSON.stringify(t));

            var resposeData = {
                "intersectionName": null,
                "cars": taCars,
                "people": taPeople
            };

            res.setHeader('Content-Type', 'application/json');
            res.json(resposeData);
        });
    });
});

// ------------------------------------------------------------------
// WEB SERVICE - RESET
//               (Delete All Data)
// ------------------------------------------------------------------
app.get('/reset', function (req, res) {
    console.log('Executing WebService: reset');

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('intersections').remove();
    });

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('intersection_traffic').remove();
    });

    res.send({});
});

// Public folder
app.use(express.static(path.join(__dirname, 'www')));

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Web Server
var server = app.listen(3000, function () {
    console.log('Smart City - Server started');
});