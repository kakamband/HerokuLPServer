"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
app.get('/', function (req, res) {
    res.json({ result: "ok" });
});
app.listen(5000, function () {
    console.log('server started on port 5000');
});
