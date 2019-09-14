"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var proximity_1 = require("../apis/proximity");
var router = express.Router();
// router.get('/*', (req: express.Request, res: express.Response, next) => {
//     res.cookie("testing cookie", "hello world");
//     next();
// });
// router.get('/', (req: express.Request, res: express.Response) => {
//     res.sendFile(path.join(__dirname, '..', "views", "index.html"));
// });
//bad: what if file does not exist
// router.get('/scripts/:file', (req: express.Request, res: express.Response) => {
//     res.sendFile(path.join(__dirname, '..', "views", "scripts", req.params.file));
// });
// router.post('/*', (req: express.Request, res: express.Response, next) => {
//     console.log(req);
//     next();
// });
router.post('/test', function (req, res) {
    console.log(req.body);
    res.json({ res: true });
});
router.post('/proximity_multiple', function (req, res) {
    console.log(req.body);
    var queries = req.body.queries;
    if (queries === undefined || queries.length === undefined || queries.length == 0) {
        res.json({ success: false });
    }
    try {
        var start = queries[0].start;
        var item = queries[0].item;
        var mode = queries[0].mode;
        if (start === undefined || item === undefined || mode === undefined) {
            res.json({ success: false });
            return;
        }
        var ans_1 = [];
        var f_1 = function (distances, recurse) {
            ans_1.push(distances);
            if (recurse == queries.length - 1) {
                res.json({ success: true, data: ans_1 });
                return;
            }
            else {
                recurse += 1;
                var start_1 = queries[recurse].start;
                var item_1 = queries[recurse].item;
                var mode_1 = queries[recurse].mode;
                proximity_1.runDistanceCalc(start_1, item_1, mode_1, function (distances) {
                    f_1(distances, recurse);
                });
            }
        };
        proximity_1.runDistanceCalc(start, item, mode, function (distances) {
            f_1(distances, 0);
        });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});
router.post('/proximity', function (req, res) {
    console.log(req.body);
    try {
        var start = req.body.start;
        var item = req.body.item;
        var mode = req.body.mode;
        if (start === undefined || item === undefined || mode === undefined) {
            res.json({ success: false });
            return;
        }
        proximity_1.runDistanceCalc(start, item, mode, function (distances) {
            if (distances == null) {
                res.json({ success: false });
            }
            else {
                res.json({ success: true, data: distances });
            }
        });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});
exports.default = router;
//# sourceMappingURL=main.js.map