const request = require("request");

// weatherstack api call and response handler
const forecast = (latitude, longitude, callback) => {
  const url =
    "http://api.weatherstack.com/current?access_key=" + process.env.WEATHERSTACKAPIKEY + "&query=" +
    latitude +
    "," +
    longitude +
    "&units=f";

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather services", undefined);
    } else if (body.error) {
      callback(
        "Unable to find location through weather services, try another search",
        undefined
      );
    } else {
      callback(
        undefined,
        body.location.name +
          " is " +
          body.current.weather_descriptions[0].toLowerCase() +
          ". It is currently " +
          body.current.temperature +
          " degrees out and feels like " +
          body.current.feelslike +
          " degrees. The humidity is " + 
          body.current.humidity +
          "% with winds at " +
          body.current.wind_speed +
          "mph."
      );
    }
  });
};

module.exports = forecast;
