"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// this is the server file
require("dotenv").config();
var api_key = process.env.api_key || "";
console.log(api_key);
var part1 = ["snippet"];
var videoId = "NMre6IAAAiU";
var chatId = "";
var access_token = process.env.access_token || "";
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
