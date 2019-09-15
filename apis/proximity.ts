import request = require("request");
import { URL } from "url";
import { APIKEYS } from "../apikeys"

const geocodeString = "https://maps.googleapis.com/maps/api/geocode/json";
const findPlaceString = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
const distanceMatrixString = "https://maps.googleapis.com/maps/api/distancematrix/json";
/**
 * 
 * @param address The street address that you want to geocode, in the format used by the national postal service of the country concerned.
 * @param next callback/next function
 */
function getLongLat(address: string, next) {
    const url = new URL(geocodeString);
    url.searchParams.set('key', APIKEYS.googleAPI);
    url.searchParams.set('address', address);

    request(url.href, (error, response, body) => {
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

function findPlace(locations, place: string, next) {
    if (locations == null) {
        next(null);
        return;
    }

    const url = new URL(findPlaceString);
    url.searchParams.set('key', APIKEYS.googleAPI);
    url.searchParams.set('input', place);
    url.searchParams.set('inputtype', "textquery");

    if (locations.results === undefined || locations.results.length == 0) {
        next(null);
        return;
    }

    const loc = locations.results[0].geometry.location;
    //Point: A single lat/lng coordinate. Use the following format: point:lat,lng
    const point = "point:" + loc.lat.toString() + "," + loc.lng.toString();

    url.searchParams.set("locationbias", point);
    url.searchParams.set("fields", "formatted_address,geometry,place_id");

    request(url.href, (error, response, body) => {
        body = JSON.parse(body);
        next(body);
    });
}

export const MODES = {
    driving: "driving",
    biking: "bicycling",
    walking: "walking",
    transit: "transit"
};

function calcDistances(start, locations, mode: string, next) {
    if (start == null || locations == null) {
        next(null);
        return;
    }
    const url = new URL(distanceMatrixString);
    url.searchParams.set('key', APIKEYS.googleAPI);
    url.searchParams.set('mode', mode);

    if (start.results === undefined || start.results.length == 0
        || locations.candidates === undefined || locations.candidates.length == 0) {
        next(null);
        return;
    }

    let origins = "place_id:" + start.results[0].place_id.toString();
    let destinations = "place_id:" + locations.candidates[0].place_id.toString();

    url.searchParams.set('origins', origins);
    url.searchParams.set('destinations', destinations);

    request(url.href, (error, response, body) => {
        body = JSON.parse(body);
        next(body);
    });
}

export function runDistanceCalc(start: string, item: string, mode: string, next) {
    getLongLat(start, (longLat) => {
        findPlace(longLat, item, (places) => {
            calcDistances(longLat, places, mode, (distances) => {
                next(distances);
            });
        });
    });
}

export function test() {
    const url = new URL(findPlaceString);
    url.searchParams.set('key', APIKEYS.googleAPI)

    const start = "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA";
    runDistanceCalc(start, "police", MODES.biking, (distances) => { console.log(distances); });
}