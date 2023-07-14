const fs = require("fs");
const axios = require("axios");
const winston = require("winston");
const moment = require("moment");
const { NIL: NIL_UUID } = require("uuid");

const ACTIVITIES_FILE = "./data/activities.json";
const WORKLOG_FILE = "./models/worklog.json";

require("dotenv").config();

const reslogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "seed-service" },
  transports: [new winston.transports.File({ filename: "logs/responses.log" })],
});

const config = {
  headers: {
    Authorization: `Bearer ${process.env.TIMETRACKER_BEARER_TOKEN}`,
  },
};

axios
  .get(
    `${process.env.TIMETRACKER_URL}/api/rest/activityTypes?api-version=${process.env.TIMETRACKER_API_VERSION}`,
    config
  )
  .then((res) => {
    reslogger.info(`HTTP ${res.status} | ${JSON.stringify(res.data)}`);

    const activities = res.data["data"]["activityTypes"];

    fs.writeFile(
      ACTIVITIES_FILE,
      JSON.stringify(activities, null, 4),
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );

    const worklogs = activities.filter((x) => x["id"] !== NIL_UUID);
    const exampleWorklog = {
      date: moment().format("YYYY-MM-DD[T09:00:00]"),
      length: 0.5,
      workItemId: null,
      comment: null,
    };

    const obj = worklogs.reduce((accumulator, value, index) => {
      accumulator[value["name"]] = index === 0 ? [exampleWorklog] : [];
      return accumulator;
    }, {});

    fs.writeFile(WORKLOG_FILE, JSON.stringify(obj, null, 4), (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
