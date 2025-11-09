require("dotenv").config({ path: "../../.env" });

module.exports = {
  transpilePackages: ['ui'],
  images: {
    domains: ['s2.googleusercontent.com', 'static.wixstatic.com']
  }
};