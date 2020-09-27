"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// this is the server file
require("dotenv").config();
var googleapis_1 = require("googleapis");
var api_key = process.env.api_key || "";
console.log(api_key);
var part1 = ["snippet"];
googleapis_1.google
    .youtube("v3")
    .search.list({
    key: api_key,
    part: part1,
    q: "bitsplease",
})
    .then(function (response) {
    var _a;
    console.log(response.data);
    var data = response.data;
    (_a = data.items) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
        //console.log(item.snippet?.title);
        //console.log(item.snippet?.liveBroadcastContent);
        //console.log(item.snippet?.description);
    });
})
    .catch(function (err) {
    console.log(err);
});
