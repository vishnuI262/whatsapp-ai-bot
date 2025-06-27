const express = require("express");
const path = require("path");
const { MessagingResponse } = require("twilio").twiml;
const aiResponder = require("./aiResponder");
const fileMapper = require("./fileMapper");

require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: false }));

// To serve files directly
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.post("/whatsapp", async (req, res) => {
  const incomingMsg = req.body.Body;
  const twiml = new MessagingResponse();

  // 1. AI-generated message
  const aiReply = await aiResponder(incomingMsg);
  twiml.message(aiReply);

  // 2. Add attachments
  const { pdf, image, video } = fileMapper(incomingMsg.toLowerCase());

  if (image) twiml.message().media(image);
  if (pdf) twiml.message().media(pdf);
  if (video) twiml.message().media(video); // optional placeholder video

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

app.listen(3000, () => {
  console.log("🚀 WhatsApp bot running at http://localhost:3000");
});
