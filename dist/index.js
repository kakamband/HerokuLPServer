"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var PORT = process.env.PORT || 5000;
var app = express();
app.get('/', function (req, res) {
    res.json({ result: "ok?" });
});
app.listen(PORT, function () { return console.log("Listening on " + PORT); });
