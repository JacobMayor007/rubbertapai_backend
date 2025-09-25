require("dotenv").config();
const express = require("express");
const routes = require("./routing/index");
const { database } = require("./lib/appwrite");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/", routes);

// const getUsersLocation = async () => {
//   try {
//     const response = await database.listDocuments(
//       `${process.env.APPWRITE_DATABASE_ID}`,
//       `${process.env.APPWRITE_USER_COLLECTION_ID}`
//     );

//     response.documents.map((data, index) => {
//       if (data.pushToken) {
//         console.log(`User ${index} \n`, data);
//       }
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

// const checkWeatherAndNotify = async (checkUserWeather) => {};

// setInterval(getUsersLocation, 10000);

app.listen(port, () => {
  console.log(`Listening on PORT ${port}`);
});
