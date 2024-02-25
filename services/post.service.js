exports.generatePostTitleSlug = (title) => {
  return title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
};
