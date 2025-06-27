const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async function aiResponder(prompt) {
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an assistant that responds to queries and recommends media files (PDF, image, video) if relevant. Only suggest them if truly needed. If user says 'no video', 'no image', or 'only pdf', respect it. Reply ONLY in this exact JSON format:

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
    ]
    // ❌ REMOVE THIS:
    // response_format: "json"
  });

  const response = chatCompletion.choices[0].message.content.trim();

  try {
    return JSON.parse(response);
  } catch (err) {
    console.error("❌ JSON Parse Error:", err);
    return {
      reply: response, // fallback to raw reply
      attachments: { pdf: false, image: false, video: false }
    };
  }
};
