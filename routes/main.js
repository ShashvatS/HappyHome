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
router.post('/proximity', function (req, res) {
    console.log(req.body);
    try {
        var start = req.body.start;
        var item = req.body.item;
        var mode = req.body.mode;
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