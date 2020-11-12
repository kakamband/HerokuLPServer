"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var rpi_1 = require("./ribosomes/rpi");
var user = require("./tools/user");
var genetics = require("./tools/genetics");
// -- =====================================================================================
var PORT = process.env.PORT || 5000;
var app = express();
// -- =====================================================================================
// .. Providing Ribosomes filtered by Institute
app.get('/ribosome', function (req, res) {
    res.json(rpi_1.rpi.filter(function (r) { return r.institute === req.query.i; }));
});
// -- =====================================================================================
// .. Providing New Chromosome
app.get('/crypto_cell', function (req, res) {
    // .. validating User
    user._validator(req.query.u, req.query.p, req.query.d).then(function (u) {
        // .. checking credits
        user._hasCredit(u).then(function () {
            u.gotFromThisRibosome = req.query.l;
            // .. produce a new CELL
            genetics._crypto_cell(req.query.r, u)
                .then(function (crypto_cell) {
                res.json({ status: 200, "answer": crypto_cell.cell });
                // TODO maybe we should confirm it somewhere else
                // user._received_cell( u, req.query.r as string, crypto_cell.id );
            })
                .catch(function (err) { return res.json({ status: 500, "reason": err }); });
        })
            .catch(function (err) { return res.json({ status: 402, "reason": err }); });
    })
        .catch(function (err) { return res.json({ status: 401, "reason": err }); });
});
// -- =====================================================================================
// .. Listening on Port 
app.listen(PORT, function () { return console.info("\n ... running on " + PORT + " ...\n"); });
// -- =====================================================================================
