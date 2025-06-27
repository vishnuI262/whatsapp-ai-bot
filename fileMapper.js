module.exports = function fileMapper(query) {
  if (query.includes("cnn")) {
    return {
      image:
        "http://c85f-182-72-161-70.ngrok-free.app/assets/1680532048475.jpeg",
      pdf: "http://c85f-182-72-161-70.ngrok-free.app/assets/CNN.pdf",
    };
  }

  return {};
};
