const express = require("express");
const path = require("path");
const { MessagingResponse } = require("twilio").twiml;
const aiResponder = require("./aiResponder");
const fileMapper = require("./fileMapper");

require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: false }));

// Serve static files from /assets
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Optional homepage route to prevent 404
app.get("/", (req, res) => {
  res.send("🧠 WhatsApp AI Bot is alive and listening!");
});

// Twilio webhook route
app.post("/whatsapp", async (req, res) => {
  const incomingMsg = req.body.Body;
  const twiml = new MessagingResponse();

  const aiReply = await aiResponder(incomingMsg);
  twiml.message(aiReply);

  const { pdf, image, video } = fileMapper(incomingMsg.toLowerCase());

  if (image) twiml.message().media(image);
  if (pdf) twiml.message().media(pdf);
  if (video) twiml.message().media(video); // optional

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

// Start server
app.listen(3000, () => {
  console.log("🚀 WhatsApp bot running at http://localhost:3000");
});
