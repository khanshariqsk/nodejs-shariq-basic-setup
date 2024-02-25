module.exports = {
  MONGODB_URL: process.env.MONGODB_URL,
  SERVER_TYPE: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  DEFAULT_PROFILE_IMAGE: `https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg`,
  DEFAULT_POST_IMAGE: `https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png`,
};
