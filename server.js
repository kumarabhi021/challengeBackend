"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// this is the server file
require("dotenv").config();
var googleapis_1 = require("googleapis");
var express = require("express");
var socketio = require("socket.io");
var http = require("http");
var app = express();
var server = http.createServer(app);
var io = socketio(server);
var interval;
var nextPageToken = "";
var searchString = "";
var PORT = process.env.PORT || 8080;
var countCommentSent = 0;
var api_key = process.env.api_key || "";
var part1 = ["snippet"];
var videoId = "NMre6IAAAiU";
var chatId = "";
var access_token = "";
app.get("/", function (request, response) {
    console.log("get received");
    response.send("hello world");
});
io.on("connection", function (socket) {
    console.log("we have a new connection !");
    socket.on("login", function (logindata) {
        console.log(logindata);
        access_token = logindata.token;
        console.log("access token received ");
        clearInterval(interval);
    });
    socket.on("subscribe", function (subscribedata) {
        console.log("data received from frontend : ", subscribedata);
        videoId = subscribedata.videoId;
        console.log("video id :", videoId);
        getLiveChat(videoId, socket, subscribedata.keywords);
    });
    socket.on("disconnect", function () {
        console.log("User left");
        access_token = "";
        videoId = "";
        clearInterval(interval);
    });
    socket.on("stopPolling", function (data) {
        clearInterval(interval);
        console.log("setinterval cleared ");
    });
});
var getLiveChat = function (videoId, socket, keywords) {
    // get the chat id
    console.log("keywords : ", keywords);
    console.log("inside getLiveCHatid function ");
    googleapis_1.google
        .youtube("v3")
        .videos.list({
        key: api_key,
        part: ["liveStreamingDetails"],
        id: ["NMre6IAAAiU"],
        access_token: access_token,
    })
        .then(function (response) {
        var _a;
        var data = response.data;
        (_a = data.items) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
            var _a;
            chatId = ((_a = item.liveStreamingDetails) === null || _a === void 0 ? void 0 : _a.activeLiveChatId) || "";
            console.log("chat id : ", chatId);
            // extracting the live chat now.
            interval = setInterval(function () {
                googleapis_1.google
                    .youtube("v3")
                    .liveChatMessages.list({
                    key: api_key,
                    liveChatId: chatId,
                    part: ["id", "snippet", "authorDetails"],
                    access_token: access_token,
                    maxResults: 1900,
                    pageToken: nextPageToken,
                })
                    .then(function (response) {
                    var _a;
                    //console.log(response);
                    var data = response.data;
                    nextPageToken = data.nextPageToken || "";
                    (_a = data.items) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
                        var _a, _b;
                        console.log((_a = item.snippet) === null || _a === void 0 ? void 0 : _a.displayMessage);
                        //console.log(item.authorDetails?.displayName);
                        // console.log(item.id);
                        keywords.forEach(function (keyword) {
                            var _a, _b, _c, _d, _e, _f, _g;
                            //console.log("keyword from foreach loop : ", keyword);
                            searchString = " " + keyword + " ";
                            if (((_b = (_a = item.snippet) === null || _a === void 0 ? void 0 : _a.displayMessage) === null || _b === void 0 ? void 0 : _b.includes(searchString)) || ((_d = (_c = item.snippet) === null || _c === void 0 ? void 0 : _c.displayMessage) === null || _d === void 0 ? void 0 : _d.startsWith(keyword)) || ((_f = (_e = item.snippet) === null || _e === void 0 ? void 0 : _e.displayMessage) === null || _f === void 0 ? void 0 : _f.endsWith(keyword))) {
                                socket.emit("commentsReady", {
                                    data: (_g = item.snippet) === null || _g === void 0 ? void 0 : _g.displayMessage,
                                });
                                countCommentSent++;
                            }
                        });
                        if (keywords.length == 0) {
                            console.log("keyword null");
                            socket.emit("commentsReady", {
                                data: (_b = item.snippet) === null || _b === void 0 ? void 0 : _b.displayMessage,
                            });
                            countCommentSent++;
                        }
                    });
                    if (countCommentSent == 0) {
                        socket.emit("commentsReady", {
                            data: "** No comments matching your entry keyword found ! **",
                        });
                    }
                })
                    .catch(function (err) {
                    console.log(err);
                });
            }, 10000);
        });
    })
        .catch(function (err) {
        console.log("error occured in fetching the live chat id");
    });
};
server.listen(PORT, function () { return console.log("server started on", PORT); });
