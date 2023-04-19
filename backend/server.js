const express = require("express");
const Twitter = require("twitter");
const serverless = require("serverless-http");
const createError = require("http-errors");
const morgan = require("morgan");
require("dotenv").config();
const router = express.Router();
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// Setting up Twittr Client
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_API_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_API_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET,
});

app.use(
  cors({
    origin: "https://trendingtweets.netlify.app",
  })
);

router.get("/", async (req, res, next) => {
  res.send({ message: "Awesome it works 🐻" });
});

// To get treading topics...
router.get("/trends", async (req, res, next) => {
  try {
    const id = req.query.woeid;
    const trends = await client.get("trends/place.json", { id: id });
    res.send(trends);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

// This route gets the WOEID for a particular location (lat/long)
router.get("/near-me", async (req, res, next) => {
  try {
    const { lat, long } = req.query;
    const response = await client.get("/trends/closest.json", {
      lat,
      long,
    });
    res.send(response);
  } catch (error) {
    next(error);
  }
});

//app.use('/api', require('./routes/api-route'));

app.use("/.netlify/functions/server", router); // path must route to lambda

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

module.exports = app;
module.exports.handler = serverless(app);

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
