const express = require("express");
const sessionController = require("../controllers/sessionController");

const router = express.Router();

router.post("/login", sessionController.createSession);
router.post(
  "/upload",
  sessionController.uploadFile.fields([
    { name: "usernames", maxCount: 1 },
    { name: "msgs", maxCount: 1 },
  ]),
  sessionController.uploadData
);

module.exports = router;
