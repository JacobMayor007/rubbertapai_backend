require("dotenv").config();
const express = require("express");
const routes = require("./routing/index");
const { database } = require("./lib/appwrite");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const dayjs = require("dayjs");
const { Expo } = require("expo-server-sdk");
const cors = require("cors");

dayjs.extend(utc);
dayjs.extend(timezone);

let expo = new Expo();

const app = express();
const port = process.env.PORT;

// FIX: Middleware order is important - urlencoded should come first
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/", routes);

const getUsersLocation = async () => {
  try {
    const response = await database.listDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`
    );

    for (const data of response.documents) {
      if (data.pushToken && data.city) {
        await checkWeatherAndNotify(data);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const checkWeatherAndNotify = async (checkUserWeather) => {
  const response = await fetch(
    `${process.env.WEATHER_ENDPOINT}/forecast.json?key=${process.env.WEATHER_KEY}&q=${checkUserWeather.city}&days=2`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const forecastDays = data.forecast.forecastday;
  const token = checkUserWeather.pushToken;
  const weatherAlert = checkUserWeather.weatherAlert;

  if (!weatherAlert) return;

  // ✅ Get timezone from weather data
  const userTimezone = data.location.tz_id || "Asia/Manila";

  // ✅ Use user's local time
  const currentHour = dayjs().tz(userTimezone).hour();
  let targetHour = currentHour + 1;
  let dayIndex = 0;

  if (targetHour >= 24) {
    targetHour = 0;
    dayIndex = 1;
  }

  console.log(
    `Current local time (${userTimezone}):`,
    dayjs().tz(userTimezone).format()
  );
  console.log("Target hour:", targetHour, "Day index:", dayIndex);

  if (!forecastDays[dayIndex] || !forecastDays[dayIndex].hour[targetHour]) {
    console.log(
      `No forecast data available for hour ${targetHour} on day ${dayIndex}`
    );
    return;
  }

  const targetHourData = forecastDays[dayIndex].hour[targetHour];

  // ✅ Notification time in local format
  const localTimeFormatted = dayjs()
    .tz(userTimezone)
    .hour(targetHour)
    .minute(0)
    .format("hh:00 A");

  if (targetHourData.will_it_rain === 1) {
    if (!Expo.isExpoPushToken(token)) {
      console.error("Invalid Expo push token:", token);
      return;
    }

    const messages = [
      {
        to: token,
        sound: "default",
        title: "Rain Warning Alert ☔",
        body: `It might rain around ${localTimeFormatted} in ${checkUserWeather.city}. Chance of rain: ${targetHourData.chance_of_rain}%`,
      },
    ];

    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(messages);
      console.log("Notification sent:", ticketChunk);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }
};

// Run every 10 minutes
setInterval(() => {
  getUsersLocation();
}, 10 * 60 * 1000);

app.listen(port, () => {
  console.log(`Listening on PORT ${port}`);
});
