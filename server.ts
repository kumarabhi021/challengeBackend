// this is the server file
require("dotenv").config();
import { response } from "express";
import { google } from "googleapis";
import { chat } from "googleapis/build/src/apis/chat";
const api_key: string = process.env.api_key || "";
console.log(api_key);
const part1: string[] = ["snippet"];

const videoId: string = "NMre6IAAAiU";
let chatId: string = "";
const access_token: string = process.env.access_token || "";
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
