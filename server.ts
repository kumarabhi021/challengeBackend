// this is the server file
require("dotenv").config();
import { response } from "express";
import { google } from "googleapis";
const api_key: string = process.env.api_key || "";
console.log(api_key);
const part1: string[] = ["snippet"];

google
  .youtube("v3")
  .search.list({
    key: api_key,
    part: part1,
    q: "bitsplease",
  })
  .then((response) => {
    console.log(response.data);
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
