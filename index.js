const express = require("express");
const path = require("path");
const { MessagingResponse } = require("twilio").twiml;
const aiResponder = require("./aiResponder");
const fileMapper = require("./fileMapper");

require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: false }));

app.use("/assets", express.static(path.join(__dirname, "assets"), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".mp4")) {
      res.setHeader("Content-Type", "video/mp4");
    }
    if (filePath.endsWith(".pdf")) {
      res.setHeader("Content-Type", "application/pdf");
    }
    if (filePath.endsWith(".jpeg") || filePath.endsWith(".jpg")) {
      res.setHeader("Content-Type", "image/jpeg");
    }
  },
}));

app.get("/", (req, res) => {
  res.send("WhatsApp AI Bot is alive and listening!");
});

app.post("/whatsapp", async (req, res) => {
  const incomingMsg = req.body.Body;
  const twiml = new MessagingResponse();

  const aiReply = await aiResponder(incomingMsg);
  console.log(aiReply);
  twiml.message(aiReply);

  const { pdf, image, video } = fileMapper(incomingMsg.toLowerCase());

  if (image) twiml.message().media(image);
  if (pdf) twiml.message().media(pdf);
  if (video) twiml.message().media(video);

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

app.listen(3000, () => {
  console.log("🚀 WhatsApp bot running at http://localhost:3000");
});
