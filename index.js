const fs = require('fs');
const path = require('path');
const axios = require('axios');
const winston = require('winston');
const { v4: uuidv4 } = require('uuid');

const FILE_EXTENSION = '.json';
const STAGE_PATH = './models/stage/';
const PROCESSED_PATH = './models/processed/';

if (!fs.existsSync(PROCESSED_PATH)){
  fs.mkdirSync(PROCESSED_PATH, { recursive: true });
}

require('dotenv').config();

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

fs.readdir(STAGE_PATH, (err, files) => {
    if (!files) throw new Error(`No ${FILE_EXTENSION} files available`);
    
    const targetFiles = files.filter(file => {
        return path.extname(file).toLowerCase() === FILE_EXTENSION;
    });
    
    for (const file of targetFiles.values()) {
      let data = JSON.parse(fs.readFileSync(`${STAGE_PATH}${file}`));

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
      
                  axios.post(`${process.env.TIMETRACKER_URL}/api/rest/workLogs?api-version=${process.env.TIMETRACKER_API_VERSION}`, req, config).then((res) => {
                      reslogger.info(`HTTP ${res.status} | ${JSON.stringify(res.data)}`)
                  });
      
              }
        }
      }
      
      const oldPath = `${STAGE_PATH}${file}`;
      const newPath = `${PROCESSED_PATH}${uuidv4()}${FILE_EXTENSION}`;
      
      fs.rename(oldPath, newPath, function (err) {
          if (err) throw err
          console.log('Successfully renamed - AKA moved!')
        });
    }
});