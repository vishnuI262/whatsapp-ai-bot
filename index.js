const express = require("express");
const path = require("path");
const { MessagingResponse } = require("twilio").twiml;
const aiResponder = require("./aiResponder");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: false }));

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.send("WhatsApp AI Bot is alive and listening!");
});

app.post("/whatsapp", async (req, res) => {
  const incomingMsg = req.body.Body;
  const twiml = new MessagingResponse();

  try {
    const aiResponse = await aiResponder(incomingMsg);
    const { reply, attachments } = aiResponse;

    twiml.message(reply);

    if (attachments?.image)
      twiml.message().media("https://whatsapp-ai-bot-yplb.onrender.com/assets/1680532048475.jpeg");

    if (attachments?.pdf)
      twiml.message().media("https://whatsapp-ai-bot-yplb.onrender.com/assets/CNN.pdf");

    if (attachments?.video)
      twiml.message().media("https://whatsapp-ai-bot-yplb.onrender.com/assets/cnn.mp4");

  } catch (err) {
    console.error("AI Error:", err);
    twiml.message("Sorry, there was an error processing your request.");
  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

app.listen(3000, () => {
  console.log("WhatsApp bot running at http://localhost:3000");
});
