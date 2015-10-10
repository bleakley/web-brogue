var GameRecord = require("../database/game-record-model");
var paginate = require("express-paginate");

module.exports = function(app) {

    var sortFromQueryParams = function(req, defaultSort) {
        if (req.query.sort) {
            if (req.query.order && req.query.order === "desc") {
                return "-" + req.query.sort;
            }
            else {
                return req.query.sort;
            }
        }
        else {
            return defaultSort;
        }
    };

    app.use(paginate.middleware(10, 50));

    app.get("/api/games", function (req, res) {
        GameRecord.paginate({}, {
            page: req.query.page,
            limit: req.query.limit,
            sortBy: sortFromQueryParams(req, '-date')
        }, function (err, gameRecords, pageCount, itemCount) {

            if (err) return next(err);

            res.format({
                json: function () {
                    res.json({
                        object: 'list',
                        data: gameRecords,
                        pageCount: pageCount,
                        itemCount: itemCount
                    });
                }
            });
        });
    });

    app.get("/api/dailygames", function (req, res) {

        var now = new Date();
        var startTime = now.setUTCHours(0,0,0,0);
        var endTime = now.setUTCHours(24,0,0,0);

        GameRecord.paginate(
            {
                date: {
                    $gte: startTime,
                    $lt: endTime
                },
                easyMode: false,
                score: {
                    $gt: 0
                }
            },
            {   page: req.query.page,
                limit: req.query.limit,
                sortBy: sortFromQueryParams(req, '-score')
        }, function (err, gameRecords, pageCount, itemCount) {

            if (err) return next(err);

            res.format({
                json: function () {
                    res.json({
                        object: 'list',
                        data: gameRecords,
                        pageCount: pageCount,
                        itemCount: itemCount
                    });
                }
            });
        });
    });

    app.get("/api/monthlygames", function (req, res) {

        var now = new Date();
        var startTime = new Date(now.getFullYear(), now.getMonth(), 1);
        var endTime = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        GameRecord.paginate(
            {
                date: {
                    $gte: startTime,
                    $lt: endTime
                },
                easyMode: false,
                score: {
                    $gt: 0
                }
            },
            {   page: req.query.page,
                limit: req.query.limit,
                sortBy: sortFromQueryParams(req, '-score')
            }, function (err, gameRecords, pageCount, itemCount) {

                if (err) return next(err);

                res.format({
                    json: function () {
                        res.json({
                            object: 'list',
                            data: gameRecords,
                            pageCount: pageCount,
                            itemCount: itemCount
                        });
                    }
                });
            });
    });

    app.get("/api/games/:username", function (req, res) {

        GameRecord.paginate({username: req.params.username}, {
            page: req.query.page,
            limit: req.query.limit,
            sortBy: sortFromQueryParams(req, '-date')
        }, function (err, gameRecords, pageCount, itemCount) {

            if (err) return next(err);

            res.format({
                json: function () {
                    res.json({
                        object: 'list',
                        data: gameRecords,
                        pageCount: pageCount,
                        itemCount: itemCount
                    });
                }
            });
        });
    });
};