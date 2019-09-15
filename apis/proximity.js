"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var url_1 = require("url");
var apikeys_1 = require("../apikeys");
var geocodeString = "https://maps.googleapis.com/maps/api/geocode/json";
var findPlaceString = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
var distanceMatrixString = "https://maps.googleapis.com/maps/api/distancematrix/json";
/**
 *
 * @param address The street address that you want to geocode, in the format used by the national postal service of the country concerned.
 * @param next callback/next function
 */
function getLongLat(address, next) {
    var url = new url_1.URL(geocodeString);
    url.searchParams.set('key', apikeys_1.APIKEYS.googleAPI);
    url.searchParams.set('address', address);
    request(url.href, function (error, response, body) {
        if (body === undefined) {
            next(null);
            return;
        }
        else {
            body = JSON.parse(body);
            next(body);
        }
    });
}
function findPlace(locations, place, next) {
    if (locations == null) {
        next(null);
        return;
    }
    var url = new url_1.URL(findPlaceString);
    url.searchParams.set('key', apikeys_1.APIKEYS.googleAPI);
    url.searchParams.set('input', place);
    url.searchParams.set('inputtype', "textquery");
    if (locations.results === undefined || locations.results.length == 0) {
        next(null);
        return;
    }
    var loc = locations.results[0].geometry.location;
    //Point: A single lat/lng coordinate. Use the following format: point:lat,lng
    var point = "point:" + loc.lat.toString() + "," + loc.lng.toString();
    url.searchParams.set("locationbias", point);
    url.searchParams.set("fields", "formatted_address,geometry,place_id");
    request(url.href, function (error, response, body) {
        body = JSON.parse(body);
        next(body);
    });
}
exports.MODES = {
    driving: "driving",
    biking: "bicycling",
    walking: "walking",
    transit: "transit"
};
function calcDistances(start, locations, mode, next) {
    if (start == null || locations == null) {
        next(null);
        return;
    }
    var url = new url_1.URL(distanceMatrixString);
    url.searchParams.set('key', apikeys_1.APIKEYS.googleAPI);
    url.searchParams.set('mode', mode);
    if (start.results === undefined || start.results.length == 0
        || locations.candidates === undefined || locations.candidates.length == 0) {
        next(null);
        return;
    }
    var origins = "place_id:" + start.results[0].place_id.toString();
    var destinations = "place_id:" + locations.candidates[0].place_id.toString();
    url.searchParams.set('origins', origins);
    url.searchParams.set('destinations', destinations);
    request(url.href, function (error, response, body) {
        body = JSON.parse(body);
        next(body);
    });
}
function runDistanceCalc(start, item, mode, next) {
    getLongLat(start, function (longLat) {
        findPlace(longLat, item, function (places) {
            calcDistances(longLat, places, mode, function (distances) {
                next(distances);
            });
        });
    });
}
exports.runDistanceCalc = runDistanceCalc;
function test() {
    var url = new url_1.URL(findPlaceString);
    url.searchParams.set('key', apikeys_1.APIKEYS.googleAPI);
    var start = "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA";
    runDistanceCalc(start, "police", exports.MODES.biking, function (distances) { console.log(distances); });
}
exports.test = test;
//# sourceMappingURL=proximity.js.map