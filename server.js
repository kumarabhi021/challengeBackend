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
var PORT = process.env.PORT || 8080;
var api_key = process.env.api_key || "";
console.log(api_key);
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
        console.log(access_token);
    });
    socket.on("subscribe", function (subscribedata) {
        console.log(subscribedata);
        videoId = subscribedata.videoId;
        console.log("video id :", videoId);
        getLiveChat(videoId, socket);
    });
    socket.on("disconnect", function () {
        console.log("User left");
        access_token = "";
        videoId = "";
    });
});
var getLiveChat = function (videoId, socket) {
    // get the chat id
    console.log("inside getLiveCHatid");
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
            googleapis_1.google
                .youtube("v3")
                .liveChatMessages.list({
                key: api_key,
                liveChatId: chatId,
                part: ["snippet", "authorDetails"],
                access_token: access_token,
            })
                .then(function (response) {
                var _a;
                // console.log(response);
                var data = response.data;
                (_a = data.items) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
                    var _a, _b;
                    console.log((_a = item.snippet) === null || _a === void 0 ? void 0 : _a.displayMessage);
                    // console.log(item.authorDetails?.displayName);
                    socket.emit("commentsReady", {
                        data: (_b = item.snippet) === null || _b === void 0 ? void 0 : _b.displayMessage,
                    });
                });
            })
                .catch(function (err) {
                console.log(err);
            });
        });
    })
        .catch(function (err) {
        console.log("error occured in fetching the live chat id");
    });
};
/*
// extracting the chat id for the live video
google
  .youtube("v3")
  .videos.list({
    key: api_key,
    part: ["liveStreamingDetails"],
    id: ["NMre6IAAAiU"],
    access_token: access_token,
  })
  .then((response) => {
    const { data } = response;
    data.items?.forEach((item) => {
      chatId = item.liveStreamingDetails?.activeLiveChatId || "";
      console.log(chatId);
      // extracting the live chat now.
      google
        .youtube("v3")
        .liveChatMessages.list({
          key: api_key,
          liveChatId: chatId,
          part: ["snippet", "authorDetails"],
          access_token: access_token,
        })
        .then((response) => {
          // console.log(response);
          const { data } = response;
          data.items?.forEach((item) => {
            console.log(item.snippet?.displayMessage);
            // console.log(item.authorDetails?.displayName);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  })
  .catch((err) => {
    console.log(err);
  });

*/
server.listen(PORT, function () { return console.log("server started on", PORT); });
