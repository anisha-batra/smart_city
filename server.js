var express = require('express');
var app = express();

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
        "intersectionName": req.body.intersectionName,
        "latitude": req.body.intersectionLatitude,
        "longitude": req.body.IntersectionLongitude
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
            console.log("- All Intersections: " + arrayOfDocs);

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
//               (Create One Record Per Detection)
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
        "intersectionName"   : req.body.intersectionName,
        "detectedTrafficType": req.body.detectedTrafficType,
        "detectedOn"         : req.body.detectedOn
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
            console.log("- All Detecttion: " + arrayOfDocs);

            res.setHeader('Content-Type', 'application/json');
            res.json(arrayOfDocs);
        });
    });
});

// ------------------------------------------------------------------
// WEB SERVICE - GET ALL DETECTIONS OF TRAFFIC TYPE
// ------------------------------------------------------------------
app.get('/getAllDetectionsOfType/:trafficType', function (req, res) {
    console.log('Executing Web Service: Get All Detections Of Type');

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var trafficType = req.params.trafficType;

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('intersection_traffic').find({ 'detectedTrafficType': trafficType }).toArray(function (err, arrayOfDocs) {
            assert.equal(err, null);
            console.log("- All Detection Of Type = " + trafficType + ": " + arrayOfDocs);

            res.setHeader('Content-Type', 'application/json');
            res.json(arrayOfDocs);
        });
    });
});

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
            console.log("- All Detections At Intersection = " + intersectionName + ": " + arrayOfDocs);

            res.setHeader('Content-Type', 'application/json');
            res.json(arrayOfDocs);
        });
    });
});

// ------------------------------------------------------------------
// WEB SERVICE - GET ALL DETECTIONS OF TYPE AT INTERSECTION
// ------------------------------------------------------------------
app.get('/getAllDetectionsOfTypeAtIntersection/:trafficType/:intersectionName', function (req, res) {
    console.log('Executing Web Service: Get All Detections At Intersection');

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var trafficType = req.params.trafficType;
    var intersectionName = req.params.intersectionName;

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('intersection_traffic').find({ 'detectedTrafficType': trafficType, 'intersectionName': intersectionName }).toArray(function (err, arrayOfDocs) {
            assert.equal(err, null);
            console.log("- All Detections Of Type = " + trafficType + " At Intersection = " + intersectionName + ": " + arrayOfDocs);

            res.setHeader('Content-Type', 'application/json');
            res.json(arrayOfDocs);
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

// Start Web Server
var server = app.listen(3000, function () {
    console.log('Smart City - Server started');
});