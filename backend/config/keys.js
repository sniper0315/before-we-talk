module.exports = {
  mongoURI: process.env.MONGO_URI,
  emailConfirmSecret: process.env.EMAIL_CONFIRM_SECRET,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshSecret: process.env.REFRESH_TOKEN_SECRET
};
