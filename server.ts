// this is the server file
require("dotenv").config();
import { response } from "express";
import { google } from "googleapis";
import { chat } from "googleapis/build/src/apis/chat";
const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 8080;

const api_key: string = process.env.api_key || "";
console.log(api_key);
const part1: string[] = ["snippet"];

let videoId: string = "NMre6IAAAiU";
let chatId: string = "";
let access_token: string = "";

app.get("/", (request: object, response: object) => {
  console.log("get received");
  response.send("hello world");
});

io.on("connection", (socket: object) => {
  console.log("we have a new connection !");
  socket.on("login", (logindata: object) => {
    console.log(logindata);
    access_token = logindata.token;
    console.log(access_token);
  });
  socket.on("subscribe", (subscribedata: Object) => {
    console.log(subscribedata);
    videoId = subscribedata.videoId;
    console.log("video id :", videoId);
    getLiveChat(videoId, socket);
  });
  socket.on("disconnect", () => {
    console.log("User left");
    access_token = "";
    videoId = "";
  });
});

const getLiveChat = (videoId: string, socket: object) => {
  // get the chat id
  console.log("inside getLiveCHatid");
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
        console.log("chat id : ", chatId);
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
              socket.emit("commentsReady", {
                data: item.snippet?.displayMessage,
              });
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
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
server.listen(PORT, () => console.log("server started on", PORT));
