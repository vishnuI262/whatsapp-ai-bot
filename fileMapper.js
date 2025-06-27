module.exports = function fileMapper(query) {
  if (query.includes("cnn")) {
    return {
      image: "https://whatsapp-ai-bot-yplb.onrender.com/assets/1680532048475.jpeg",
      pdf: "https://whatsapp-ai-bot-yplb.onrender.com/assets/CNN.pdf",
      video: "https://whatsapp-ai-bot-yplb.onrender.com/assets/cnn.mp4",
    };
  }
  return {};
};
