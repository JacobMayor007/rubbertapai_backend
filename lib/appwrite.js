require("dotenv").config();
const sdk = require("node-appwrite");

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const account = new sdk.Account(client);
const database = new sdk.Databases(client);
const storage = new sdk.Storage(client);
const { ID } = sdk;

module.exports = {
  account,
  database,
  ID,
  client,
  storage,
};
