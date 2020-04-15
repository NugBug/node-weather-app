const express = require("express");
const path = require("path");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Josh Tanguay",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Josh Tanguay",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpMessage: "More to come as additional functionality is added!",
    title: "Help",
    name: "Josh Tanguay",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.city) {
    return res.send({
      error: "you must provide a valid city",
    });
  }

  geocode(req.query.city, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }
    forecast(latitude, longitude, (error, forecast) => {
      if (error) {
        return res.send({ error });
      }
      return res.send({
        location,
        forecast,
      });
    });
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404 Error",
    name: "Josh Tanguay",
    notFound: "Help article not found.",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404 Error",
    name: "Josh Tanguay",
    notFound: "Page not found.",
  });
});

app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}.`);
});
