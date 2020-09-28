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

let countCommentSent = 0;

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
    console.log("access token received ");
  });
  socket.on("subscribe", (subscribedata: Object) => {
    console.log("data received from frontend : ",subscribedata);
    videoId = subscribedata.videoId;
    console.log("video id :", videoId);
    getLiveChat(videoId, socket, subscribedata.keywords);
  });
  socket.on("disconnect", () => {
    console.log("User left");
    access_token = "";
    videoId = "";
  });
});

const getLiveChat = (videoId: string, socket: object, keywords: string[]) => {
  // get the chat id
  console.log("keywords : ", keywords);
  console.log("inside getLiveCHatid function ");
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
        setInterval(() => {
          google
            .youtube("v3")
            .liveChatMessages.list({
              key: api_key,
              liveChatId: chatId,
              part: ["snippet", "authorDetails"],
              access_token: access_token,
              maxResults: 1900,
            })
            .then((response) => {
              console.log(response);
              const { data } = response;
              data.items?.forEach((item) => {
                console.log(item.snippet?.displayMessage);
                // console.log(item.authorDetails?.displayName);
                keywords.forEach((keyword) => {
                  console.log("keyword from foreach loop : ", keyword);
                  if (item.snippet?.displayMessage?.includes(keyword)) {
                    socket.emit("commentsReady", {
                      data: item.snippet?.displayMessage,
                    });
                    countCommentSent++;
                  }
                });
                if (keywords.length == 0) {
                  console.log("keyword null");
                  socket.emit("commentsReady", {
                    data: item.snippet?.displayMessage,
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
            .catch((err) => {
              console.log(err);
            });
        }, 5000;
      });
    })
    .catch((err) => {
      console.log("error occured in fetching the live chat id");
    });
};

server.listen(PORT, () => console.log("server started on", PORT));
