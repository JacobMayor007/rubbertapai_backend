require("dotenv").config();
const express = require("express");
const routes = require("./routing/index");
const { database } = require("./lib/appwrite");
const dayjs = require("dayjs");
const { Expo } = require("expo-server-sdk");

let expo = new Expo();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/", routes);

const getUsersLocation = async () => {
  try {
    const response = await database.listDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`
    );

    response.documents.map((data) => {
      if (data.pushToken) {
        checkWeatherAndNotify(data);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const checkWeatherAndNotify = async (checkUserWeather) => {
  const response = await fetch(
    `${process.env.WEATHER_ENDPOINT}/forecast.json?key=${process.env.WEATHER_KEY}&q=${checkUserWeather.city}&days=7`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const forecastDays = data.forecast.forecastday;
  const token = checkUserWeather.pushToken;

  console.log(JSON.stringify(forecastDays[0].hour[dayjs().hour()], null, 2));
  console.log(checkUserWeather.pushToken);
  console.log(forecastDays[0].hour[dayjs().hour()].chance_of_rain);

  if (forecastDays[0].hour[dayjs().hour()].will_it_rain === 1) {
    if (!Expo.isExpoPushToken(token)) {
      return res.status(400).send("Invalid Expo push token.");
    }

    let messages = [
      {
        to: token,
        sound: "default",
        title: "Rain Warning Alert",
        body: `The chance of rain today is ${
          forecastDays[0].hour[dayjs().hour()].chance_of_rain
        }%`,
      },
    ];
    let ticketChunk = await expo.sendPushNotificationsAsync(messages);
    console.log(ticketChunk);
  }
};

setInterval(getUsersLocation, 30 * 60 * 1000);

app.listen(port, () => {
  console.log(`Listening on PORT ${port}`);
});
