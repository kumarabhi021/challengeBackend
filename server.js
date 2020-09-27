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
var access_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjJjNmZhNmY1OTUwYTdjZTQ2NWZjZjI0N2FhMGIwOTQ4MjhhYzk1MmMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNDAwOTA1MjcxMDgzLTN2YW5kNTdpM3E1OW9rczUyamN1bm9hNDB1cmU4cG0zLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNDAwOTA1MjcxMDgzLTN2YW5kNTdpM3E1OW9rczUyamN1bm9hNDB1cmU4cG0zLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAxMDcyODA4NzQxNzQwMjIzMTMyIiwiZW1haWwiOiJrdW1hci5hYmhpMDIxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiTjE1VExrZGhjbFVNQkhCMFB2X3YxdyIsIm5hbWUiOiJBYmhpc2hlayBLdW1hciIsInBpY3R1cmUiOiJodHRwczovL2xoNC5nb29nbGV1c2VyY29udGVudC5jb20vLWdVUGtUWE5NdjBnL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FNWnV1Y2tCbnFGek1HWkExVmxYQk9HVXVwVVc2SmlQSUEvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IkFiaGlzaGVrIiwiZmFtaWx5X25hbWUiOiJLdW1hciIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNjAxMTg2NDczLCJleHAiOjE2MDExOTAwNzMsImp0aSI6IjcxYjA0NTU0OTYwN2ZmY2UyMWUxM2FmNWU4ZDJiODViZGE5MWFjMTYifQ.gizoOu9mafBqv31UI2QfPA_MnntLd1cRxdzRId_lL-6njsmnCCWFQK89ZU0I2GhegPW4b581M3EFpZWZvoWzsr2nLt7T_vgNoLn6MfTK6wwT6D6OTHh-ggW8bFDJI3xRHPfoD5PehFueRi4Iol1wAXXvmJnNPf2zoYWxvCH2WMymtTlz0wa54j8VI8ur1N9lVhpWk9K8cp58l0g4DDyh2kXEO9S_74BKloQTqbWipSSgaC6ixLzhPf6H1YJJ0dm38UgfSCgnoKPEtyhml-UxuyaurL2k-djjAEEdDCMIawlrZFqNcHTScUIlmZOA8JzjoQjI6OcXBvoeR4TcLQOFQg";
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
