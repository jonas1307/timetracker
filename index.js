const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const winston = require('winston');

const reqlogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'logs/requests.log' }),
  ],
});

const reslogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: 'logs/responses.log' }),
    ],
  });

let activities = JSON.parse(fs.readFileSync('data/activities.json'));
let data = JSON.parse(fs.readFileSync('models/activities.json'));

for (const activity of activities.values()) {

    let worklogs = data[activity.name]

    if (worklogs && worklogs.length > 0) {

        for (const worklog of worklogs.values()) {

            let req = {
                timeStamp: worklog.date,
                length: worklog.length * 60 * 60,
                billableLength: null,
                workItemId: worklog.workItemId,
                comment: worklog.comment,
                userId: process.env.TIMETRACKER_USER_ID,
                activityTypeId: activity.id,
            }

            reqlogger.info(JSON.stringify(req))
            
            const config = {
                headers:{
                  Authorization: `Bearer ${process.env.TIMETRACKER_BEARER_TOKEN}`
                }
              };

            axios.post(process.env.TIMETRACKER_URL, req, config).then((res) => {
                reslogger.info(`HTTP ${res.status} | ${JSON.stringify(res.data)}`)
            });

        }
    }
}