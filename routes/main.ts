import express = require('express');
import path = require('path');
import { runDistanceCalc, test } from "../apis/proximity";

const router = express.Router();

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

router.post('/test', (req: express.Request, res: express.Response) => {
    console.log(req.body);
    res.json({ res: true });
});

router.post('/proximity_multiple', (req: express.Request, res: express.Response) => {
    console.log(req.body);
    const queries = req.body.queries;

    if (queries === undefined || queries.length === undefined || queries.length == 0) {
        res.json({ success: false });
    }

    try {
        const start = queries[0].start;
        const item = queries[0].item;
        const mode = queries[0].mode;

        if (start === undefined || item === undefined || mode === undefined) {
            res.json({ success: false });
            return;
        }

        let ans = [];

        let f = function(distances, recurse: number) {
            ans.push(distances);
            if (recurse == queries.length) {
                res.json({ success: true, data: ans});
                return;
            } else {
                const start = queries[recurse].start;
                const item = queries[recurse].item;
                const mode = queries[recurse].mode;  
                
                runDistanceCalc(start, item, mode, (distances) => {
                    f(distances, recurse + 1);
                });
            }
        }

        runDistanceCalc(start, item, mode, (distances) => {
            f(distances, 0);
        });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});

router.post('/proximity', (req: express.Request, res: express.Response) => {
    console.log(req.body);

    try {
        const start = req.body.start;
        const item = req.body.item;
        const mode = req.body.mode;

        if (start === undefined || item === undefined || mode === undefined) {
            res.json({ success: false });
            return;
        }

        runDistanceCalc(start, item, mode, (distances) => {
            if (distances == null) {
                res.json({ success: false });
            } else {
                res.json({ success: true, data: distances });
            }
        });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});

export default router;