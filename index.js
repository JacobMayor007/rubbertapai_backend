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

  // Fix time calculation - use 0-23 range
  let currentHour = dayjs().hour();
  let targetHour = currentHour + 1;
  let dayIndex = 0;

  // If target hour is 24, it means we're looking at the first hour of the next day
  if (targetHour >= 24) {
    targetHour = 0;
    dayIndex = 1;
  }

  console.log("Target hour:", targetHour);
  console.log("Day index:", dayIndex);

  // Check if we have enough forecast data
  if (!forecastDays[dayIndex] || !forecastDays[dayIndex].hour[targetHour]) {
    console.log(
      `No forecast data available for hour ${targetHour} on day ${dayIndex}`
    );
    return;
  }

  const targetHourData = forecastDays[dayIndex].hour[targetHour];
  console.log(JSON.stringify(targetHourData, null, 2));
  console.log("Push token:", checkUserWeather.pushToken);
  console.log("Target hour data:", targetHourData);

  console.log("Time: ", targetHour);
  console.log(`${dayjs().hour(targetHour).format("hh:00 A")}`);

  if (targetHourData.will_it_rain === 1) {
    if (!Expo.isExpoPushToken(token)) {
      console.error("Invalid Expo push token:", token);
      return;
    }

    let messages = [
      {
        to: token,
        sound: "default",
        title: "Rain Warning Alert",
        body: `The chance of rain at ${dayjs()
          .hour(targetHour)
          .format("hh:00 A")} is ${targetHourData.chance_of_rain}%`,
      },
    ];

    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(messages);
      console.log("Notification sent:", ticketChunk);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }
};

setInterval(getUsersLocation, 30 * 60 * 1000);

app.listen(port, () => {
  console.log(`Listening on PORT ${port}`);
});
