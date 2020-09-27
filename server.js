"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// this is the server file
require("dotenv").config();
var googleapis_1 = require("googleapis");
var api_key = process.env.api_key || "";
console.log(api_key);
var part1 = ["snippet"];
var videoId = "NMre6IAAAiU";
var chatId = "";
var access_token = process.env.access_token || "";
/*
google
  .youtube("v3")
  .search.list({
    key: api_key,
    part: part1,
    q: "bitsplease",
  })
  .then((response) => {
    // console.log(response.data);
    const { data } = response;
    data.items?.forEach((item) => {
      //console.log(item.snippet?.title);
      //console.log(item.snippet?.liveBroadcastContent);
      //console.log(item.snippet?.description);
    });
  })
  .catch((err) => {
    console.log(err);
  });
*/
// extracting the chat id for the live video
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
        console.log(chatId);
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
                var _a;
                console.log((_a = item.snippet) === null || _a === void 0 ? void 0 : _a.displayMessage);
                // console.log(item.authorDetails?.displayName);
            });
        })
            .catch(function (err) {
            console.log(err);
        });
    });
})
    .catch(function (err) {
    console.log(err);
});
