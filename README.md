# Timetracker

Timetracker is a node.js application that helps uploading work logs to the 7pace timetracker API. I find it specially helpful when I have lots of tasks to track hours, so I write them in a JSON file and then it's just a `npm start` to get things done.

## Installation

Clone this repository and use npm to restore its dependencies.

```bash
npm i
```

Then you must create a `.env` file with the following content

```
TIMETRACKER_URL="Your 7pace timetracker API base URL (without the last slash)"
TIMETRACKER_API_VERSION="3.2"
TIMETRACKER_BEARER_TOKEN="Your user bearer token (you can generate it on the settings menu)"
TIMETRACKER_USER_ID="The user id you wanna track time to, most likely a GUID"
```

## Usage

- Run the command `npm run seed` for generating `data/activities.json` file with your organization's timetracker activity types and the `models/worklog.json` file
- Create a copy of the `models/worklog.json` file on the `models/stage` folder
- On this JSON file, each Activity Type is a key on the main object, and each value is a list of your entries for tracking your work (the first activity has an entry example)
- Enter your activities on the corresponding activity type, including a required date, required length (in hours, where 1 equals one hour, 1.5 equals 1:30 and so on), required workItemId and an optional comment
- When you're done, run the command `npm start` to send your data to the API, then you're done

## Roadmap

- [x] First API integration, allowing data to be sent
- [x] User enters their data in a JSON file
- [x] JSON files are moved after processing
- [x] Activity types are automatically loaded from the API
- [x] File `models/worklog.json` is automatically generated using a seed routine
- [ ] User ID is automatically loaded from the API
- [ ] Application can be reseted with a npm routine
- [ ] Application validates activity's fields
- [ ] Application rejects files without activities
- [ ] Application has a task for changing all activities with an workItemId for another workItemId

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
