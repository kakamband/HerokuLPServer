"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ribosomesCollection_1 = require("./ribosomesCollection");
var user = require("./tools/user");
var genetics = require("./tools/genetics");
// -- =====================================================================================
var PORT = process.env.PORT || 5000;
var app = express();
// const { Pool } = require('pg');
// const pool = new Pool( {
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// } );
// -- =====================================================================================
// .. Providing Ribosomes filtered by Institute
app.get('/ribosome', function (req, res) {
    res.json(ribosomesCollection_1.ribosomesCollection.filter(function (r) { return r.institute === req.query.i; }));
});
// -- =====================================================================================
// .. Providing New Chromosome
app.get('/chromosome', function (req, res) {
    // .. validating User
    user._validator(req.query.u).then(function (userId) {
        // .. checking credits
        user._hasCredit(userId).then(function (credit) {
            // .. produce a new CELL
            genetics._crypto_cell(req.query.r, req.query.u)
                .then(function (crypto_cell) { return res.json(crypto_cell); })
                .catch(function (err) { return res.json({ "answer": null, "reason": err }); });
        })
            .catch(function (err) { return res.json({ "answer": null, "reason": err }); });
    })
        .catch(function (err) { return res.json({ "answer": null, "reason": err }); });
});
// -- =====================================================================================
// .. Listening on Port 
app.listen(PORT, function () { return console.info("\n ... running on " + PORT + " ...\n"); });
// -- =====================================================================================
