const Session = require('../models/sessionModel');
const Uids = require('../models/uidsModel');
const Messages = require('../models/messagesModel');
const UidsCounter = require('../models/uidsCounterModel');
const MessagesCounter = require('../models/msgCounterModel');
// const Email = require('../utils/email');
const EmailServer = require('../util/emailServer');
const multer = require('multer');
const cron = require('node-cron');
const { IgApiClient } = require('instagram-private-api');

const storage = multer.memoryStorage();

exports.uploadFile = multer({ storage: storage });

exports.uploadData = async (req, res) => {
  try {
    if (!req.files || !req.files.msgs || !req.files.usernames) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing JS file',
      });
    }

    const uidsData = req.files.usernames[0].buffer.toString();
    const messagesData = req.files.msgs[0].buffer.toString();
    eval(uidsData);
    eval(messagesData);
    const uidsArray = usernames.filter((el) => {
      if (el.verified === false) {
        return el;
      }
    });
    const uids = await Uids.findOne({ name: 'bagwell' });
    const messages = await Messages.findOne({ name: 'bagwell' });
    const uidsCounter = await UidsCounter.findOne({ name: 'bagwell' });
    const messagesCounter = await MessagesCounter.findOne({ name: 'bagwell' });

    // set data and save

    uids.uids = uidsArray;
    messages.messages = msgs;
    uidsCounter.counter = 0;
    messagesCounter.counter = 0;
    await uids.save();
    await messages.save();
    await uidsCounter.save();
    await messagesCounter.save();

    res.status(201).json({
      status: 'success',
      message: 'Data upload successful',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.createSession = async (req, res) => {
  const ig = new IgApiClient();
  const { username, password } = req.body;
  try {
    ig.state.generateDevice(username);
    await ig.account.login(username, password);

    const session = await Session.create({
      username,
      cookies: await ig.state.serializeCookieJar(),
      deviceState: {
        deviceString: ig.state.deviceString,
        userAgent: ig.state.appUserAgent,
        deviceGuid: ig.state.deviceId,
        phoneGuid: ig.state.phoneId,
        uuid: ig.state.uuid,
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        session,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const sendMessage = async () => {
  try {
    // Get all sessions, usernames and messages
    const sessions = await Session.find({ status: true });
    const usernamesData = await Uids.findOne({ name: 'bagwell' });
    const usernames = usernamesData.uids;
    const messagesData = await Messages.findOne({ name: 'bagwell' });
    const messages = messagesData.messages;
    const messagesCounter = await MessagesCounter.findOne({ name: 'bagwell' });
    const uidsCounterData = await UidsCounter.findOne({ name: 'bagwell' });
    const remainingUsernames = usernames.length - uidsCounterData.counter;
    // if (remainingUsernames < sessions.length) {
    //   return;
    // }
    // sessions.forEach(async (sessionData) => {
    const send = async () => {
      for (const sessionData of sessions) {
        try {
          // Get uid counter
          const uidsCounter = await UidsCounter.findOne({ name: 'bagwell' });
          if (uidsCounter.counter >= usernames.length - 1) {
            return;
          }
          // Invoke session with session data
          const ig = new IgApiClient();

          ig.state.deviceString = sessionData.deviceState.deviceString;
          ig.state.appUserAgent = sessionData.deviceState.userAgent;
          ig.state.deviceId = sessionData.deviceState.deviceGuid;
          ig.state.phoneId = sessionData.deviceState.phoneGuid;
          ig.state.uuid = sessionData.deviceState.uuid;
          await ig.state.deserializeCookieJar(JSON.stringify(sessionData.cookies));

          // Get message and uid
          const message = messages[messagesCounter.counter];
          const username = usernames[uidsCounter.counter].username;
          let firstname;
          if (usernames[uidsCounter.counter].full_name.includes(' ')) {
            firstname = usernames[uidsCounter.counter].full_name.split(' ')[0];
          } else {
            firstname = usernames[uidsCounter.counter].full_name;
          }

          // Get userId with username
          const user = await ig.user.searchExact(username);
          const userId = user.pk;

          // Send message
          const thread = ig.entity.directThread([userId.toString()]);
          const originalBroadcastText = Object.getPrototypeOf(thread).broadcastText;
          Object.getPrototypeOf(thread).broadcastText = async function () {
            const response = await originalBroadcastText.apply(this, arguments);

            const cookies = await this.client.state.serializeCookieJar();

            return { response, cookies };
          };
          const messageResponse = await thread.broadcastText(`Hi ${firstname}, ${message}`);

          uidsCounter.counter = uidsCounter.counter + 1;
          sessionData.cookies = messageResponse.cookies;
          await sessionData.save();
          await uidsCounter.save();
        } catch (err) {
          const uidsCounter = await UidsCounter.findOne({ name: 'bagwell' });
          uidsCounter.counter = uidsCounter.counter + 1;
          await uidsCounter.save();
          sessionData.status = false;
          await sessionData.save();
          const error = {
            username: sessionData.username,
            name: err.name,
            message: err.message,
            stack: err.stack,
          };
          await new EmailServer(JSON.stringify(error)).sendError();
        }
      }
    };
    await send();
    if (messagesCounter.counter < 2) {
      messagesCounter.counter = messagesCounter.counter + 1;
      await messagesCounter.save();
    } else {
      messagesCounter.counter = 0;
      await messagesCounter.save();
    }
    if (remainingUsernames < sessions.length) {
      await new EmailServer('').sendFinished();
    }
  } catch (err) {
    console.log(err);
  }
};

// cron.schedule('*/20 * * * *', () => {
//   sendMessage();
// });

// sendMessage();

// const sendMessages = async () => {
//   try {
//     const sessionData = await Session.findOne({
//       username: "amparo__mccutcheon",
//     });

//     ig.state.deviceString = sessionData.deviceState.deviceString;
//     ig.state.appUserAgent = sessionData.deviceState.userAgent;
//     ig.state.deviceId = sessionData.deviceState.deviceGuid;
//     ig.state.phoneId = sessionData.deviceState.phoneGuid;
//     ig.state.uuid = sessionData.deviceState.uuid;
//     await ig.state.deserializeCookieJar(JSON.stringify(sessionData.cookies));

//     const user = await ig.user.searchExact("aiden__glavina");
//     const userId = user.pk;

//     const thread = ig.entity.directThread([userId.toString()]);

//     const message = await thread.broadcastText("Hello world!");
//     console.log(message);
//   } catch (err) {
//     console.log(err);
//   }
// };

// sendMessage();

// (async () => {
//   await Messages.create({ messages: [], name: "bagwell" });
// await Uids.create({ uids: [], name: 'bagwell' });
//   await UidsCounter.create({ counter: 0, name: "bagwell" });
//   await MessagesCounter.create({ counter: 0, name: "bagwell" });
// })();
