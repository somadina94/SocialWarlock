const fs = require('fs');
const readline = require('readline');
const Download = require('../models/downloadModel');
const MUser = require('../models/mUserModel');
const Old = require('../models/oldModel');
const AppError = require('../util/appError');
const catchAsync = require('../util/catchAsync');
const multer = require('multer');
const B2 = require('backblaze-b2');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

exports.getFile = upload.single('file');

exports.createSort = catchAsync(async (req, res, next) => {
  const { key } = req.body;
  const muser = await MUser.findOne({ key: key });
  if (!muser) {
    return next(new AppError('Invalid key', 401));
  }
  if (!req.file) {
    return next(new AppError('Please upload a .csv file.', 404));
  }

  const b2 = new B2({
    applicationKeyId: process.env.B2_APP_KEY_ID, // or accountId: 'accountId'
    applicationKey: process.env.B2_APP_KEY, // or masterApplicationKey

    retry: {
      retries: 3, // this is the default
    },
  });

  async function uploadToBackblaze(fileName) {
    const uploadUrl = await b2.getUploadUrl({ bucketId: process.env.B2_BUCKET_ID });
    const file = await b2.uploadFile({
      uploadUrl: uploadUrl.data.uploadUrl,
      uploadAuthToken: uploadUrl.data.authorizationToken,
      fileName: `${Date.now()}-${fileName}`,
      data: fs.readFileSync(fileName),
    });

    const fileLink = `https://f005.backblazeb2.com/file/Images--Bagwell/${file.data.fileName}`;
    return fileLink;
  }

  const bufferStream = new require('stream').PassThrough();
  bufferStream.end(req.file.buffer);

  const all = [];
  const singleMales = [];
  const singleFemales = [];
  const marriedMales = [];
  const marriedFemales = [];

  const oldUids = await Old.findOne({ key: key });
  const oldData = oldUids.oldUids;

  const rl = readline.createInterface({
    input: bufferStream,
  });

  rl.on('line', (line) => {
    if (!line.includes('"user_id"') && line.startsWith('"') && line.includes('male')) {
      const uid = `${line.split(',')[0].split('"')[1]}\n`;
      if (!oldData.includes(uid) && !isNaN(Number(uid))) all.push(uid);
    }

    if (
      line.startsWith('"') &&
      line.includes('"male"') &&
      !line.includes('"user_id"') &&
      !line.includes('Married') &&
      !line.includes('In a relationship') &&
      !line.includes('Engaged')
    ) {
      const uid = `${line.split(',')[0].split('"')[1]}\n`;
      if (!oldData.includes(uid) && !isNaN(Number(uid))) singleMales.push(uid);
    } else if (
      line.startsWith('"') &&
      line.includes('female') &&
      !line.includes('user_id') &&
      !line.includes('Married') &&
      !line.includes('In a relationship') &&
      !line.includes('Engaged')
    ) {
      const uid = `${line.split(',')[0].split('"')[1]}\n`;
      if (!oldData.includes(uid) && !isNaN(Number(uid))) singleFemales.push(uid);
    } else if (
      line.startsWith('"') &&
      line.includes('female') &&
      !line.includes('user_id') &&
      (line.includes('Married') || line.includes('In a relationship') || line.includes('Engaged'))
    ) {
      const uid = `${line.split(',')[0].split('"')[1]}\n`;
      if (!oldData.includes(uid) && !isNaN(Number(uid))) marriedFemales.push(uid);
    } else if (
      line.startsWith('"') &&
      line.includes('"male"') &&
      !line.includes('user_id') &&
      (line.includes('Married') || line.includes('In a relationship') || line.includes('Engaged'))
    ) {
      const uid = `${line.split(',')[0].split('"')[1]}\n`;
      if (!oldData.includes(uid) && !isNaN(Number(uid))) marriedMales.push(uid);
    }
  });

  rl.on('close', async () => {
    const singleMalesFile = 'single-males.csv';
    const singleFemalesFile = 'single-females.csv';
    const marriedfemalesFile = 'married-females.csv';
    const marriedMalesFile = 'married-males.csv';
    const allFiles = 'all.csv';

    fs.writeFileSync(allFiles, all.join('\n'));
    fs.writeFileSync(singleMalesFile, singleMales.join('\n'));
    fs.writeFileSync(singleFemalesFile, singleFemales.join('\n'));
    fs.writeFileSync(marriedMalesFile, marriedMales.join('\n'));
    fs.writeFileSync(marriedfemalesFile, marriedFemales.join('\n'));

    await b2.authorize();

    const allUids = await uploadToBackblaze(allFiles);
    const singleMale = await uploadToBackblaze(singleMalesFile);
    const singleFemale = await uploadToBackblaze(singleFemalesFile);
    const marriedMale = await uploadToBackblaze(marriedMalesFile);
    const marriedFemale = await uploadToBackblaze(marriedfemalesFile);

    const download = await Download.create({
      key,
      allUids,
      singleMale,
      singleFemale,
      marriedMale,
      marriedFemale,
      createdAt: Date.now(),
    });

    oldUids.oldUids = [...oldData, ...all];
    await oldUids.save();

    const fileNameArray = [
      allFiles,
      singleMalesFile,
      singleFemalesFile,
      marriedMalesFile,
      marriedfemalesFile,
    ];

    for (const file of fileNameArray) {
      fs.unlink(file, (err) => {
        console.log(err);
      });
    }

    res.status(201).json({
      status: 'success',
      data: {
        download,
      },
    });
  });
});
