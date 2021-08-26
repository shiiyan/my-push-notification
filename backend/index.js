const express = require("express");
const cors = require("cors");
const webpush = require("web-push");

const app = express();
var corsOptions = {
  origin: "http://127.0.0.1:8080", // For testing purpose
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const port = 4000;
app.get("/", (req, res) => res.send("Hello World!!"));

const dummyDb = { subscription: null };
const saveToDatabase = async (subscription) => {
  dummyDb.subscription = subscription;
};
app.post("/save-subscription", async (req, res) => {
  const subscription = req.body;
  await saveToDatabase(subscription);
  res.json({ message: "success" });
});

const vapidKeys = {
  publicKey:
    "BPlvxdwm6nlHm5t4y8Zay5NR4OfR-OJJSDCd-gi_oo94K8MN8k-iaOUQUTC-FK3M-hlpfB-W2xoNUNyDCXp1Sjc",
  privateKey: "xxxxxxxxxxxxxxxxxxxxxxx",
};
webpush.setVapidDetails(
  "mailto:randomuserid@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
const sendNotification = (subscription, dataToSend = "") => {
  webpush.sendNotification(subscription, dataToSend);
};
app.get("/send-notification", (req, res) => {
  const subscription = dummyDb.subscription;
  const message = "Hello World";
  sendNotification(subscription, message);
  res.json({ message: "message sent" });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
