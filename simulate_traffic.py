import json
import urllib2

intersection = [
    {
        "intersectionName": "Intersection 1",
        "latitude": 37.322806,
        "longitude":  -121.867762
    },
    {
        "intersectionName": "Intersection 2",
        "latitude": 37.323335,
        "longitude": -121.866689
    },
    {
        "intersectionName": "Intersection 3",
        "latitude": 37.324751,
        "longitude": -121.867805
    },
    {
        "intersectionName": "Intersection 4 (449-401 Bestor St)",
        "latitude": 37.325280,
        "longitude": -121.870916
    },
    {
        "intersectionName": "Intersection 5 (349-327 Keyes St)",
        "latitude": 37.323230, 
        "longitude": -121.870900
    }
]

req = urllib2.Request('http://example.com/api/posts/create')
req.add_header('Content-Type', 'application/json')

response = urllib2.urlopen(req, json.dumps(data))