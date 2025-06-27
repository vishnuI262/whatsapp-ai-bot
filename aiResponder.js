const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async function aiResponder(prompt) {
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an assistant that responds to queries and recommends media files (PDF, image, video) if relevant. Only suggest them if truly needed. If user says 'no video', 'no image', or 'only pdf', respect it. Return JSON like:

{
  "reply": "Your text response here...",
  "attachments": {
    "pdf": true,
    "image": false,
    "video": false
  }
}`
      },
      { role: "user", content: prompt }
    ],
    response_format: "json"
  });

  return JSON.parse(chatCompletion.choices[0].message.content.trim());
};
