const Facebook = require('../models/facebookModel');
const login = require('facebook-chat-api');
const cookie = require('../cookies');
const texts = require('../messages');
const usernamesFile = require('../usernames');
const EmailServer = require('../util/emailServer');
const cron = require('node-cron');

const loginAsync = (credentials) => {
  return new Promise((resolve, reject) => {
    login(credentials, (err, api) => {
      if (err) reject(err);
      else resolve(api);
    });
  });
};

function sendMessageAsync(api, messageText, threadID) {
  return new Promise((resolve, reject) => {
    api.sendMessage(messageText, threadID, (err, messageInfo) => {
      if (err) return reject(err);
      resolve(messageInfo);
    });
  });
}

function getAppStateAsync(api) {
  return new Promise((resolve, reject) => {
    try {
      const appState = api.getAppState();
      resolve(appState);
    } catch (error) {
      reject(error);
    }
  });
}

const sendMessage = async () => {
  // Get account
  const facebooks = await Facebook.find({ status: true });

  // For of loop to send messages to the whole accounts
  for (const fb of facebooks) {
    try {
      if (!(fb.usernamesCounter >= fb.usernames.length)) {
        // Login
        var api = await loginAsync({ appState: fb.appState });

        // Get data for message
        const firstName = fb.usernames[fb.usernamesCounter].full_name.split(' ')[0];
        const message = `Hi ${firstName}, ${fb.messages[fb.messagesCounter]}`;
        const destId = fb.usernames[fb.usernamesCounter].uid;

        const response = await sendMessageAsync(api, message, destId);

        if (fb.messagesCounter >= 4) {
          fb.messagesCounter = 0;
        } else {
          fb.messagesCounter += 1;
        }
        fb.usernamesCounter += 1;

        const newAppState = await getAppStateAsync(api);
        fb.appState = newAppState;
        await fb.save();

        if (fb.usernamesCounter >= fb.usernames.length) {
          await new EmailServer(fb.name).sendFbFinished();
        }
      }
    } catch (err) {
      fb.usernamesCounter += 1;
      // const newAppState = await getAppStateAsync(api);
      // fb.appState = newAppState;
      fb.status = false;
      await fb.save();
      const error = {
        username: fb.name,
        name: err.name,
        message: err.message,
        stack: err.stack,
      };
      await new EmailServer(JSON.stringify(error)).sendFbError();
    }
  }
};

// sendMessage();

cron.schedule('*/20 * * * *', () => {
  sendMessage();
});

exports.createFacebook = async (req, res) => {
  req.body.appState = cookie;
  req.body.messages = texts.messages;
  req.body.usernames = usernamesFile.usernames;
  try {
    const facebook = await Facebook.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        facebook,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'fail',
      message: `Could not create facebook object`,
      error: err,
    });
  }
};

exports.updateFacebook = async (req, res) => {
  try {
    const facebook = await Facebook.findOne({ name: req.body.name });
    if (!facebook) {
      return res.status(404).json({
        status: 'fail',
        message: `Account not found`,
      });
    }

    const updatedFacebook = await Facebook.findByIdAndUpdate({ _id: facebook._id }, req.body, {
      new: true,
    });

    res.status(200).json({
      status: 'success',
      message: `Account updated successfully`,
      data: {
        facebook: updatedFacebook,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'fail',
      message: 'Could not update facebook object',
      error,
    });
  }
};

exports.updateFacebookCookies = async (req, res) => {
  try {
    const facebook = await Facebook.findOne({ name: req.body.name });
    facebook.appState = cookie;
    facebook.status = req.body.status;
    await facebook.save();

    res.status(200).json({
      status: 'success',
      message: `Cookies updated successfully`,
      data: {
        facebook,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      error: {
        err,
      },
    });
  }
};

exports.updateMessages = async (req, res) => {
  try {
    const facebooks = await Facebook.find();

    for (const fb of facebooks) {
      fb.messages = texts.messages;
      await fb.save();
    }

    res.status(200).json({
      status: 'success',
      facebooks: facebooks[12],
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      err,
    });
  }
};
