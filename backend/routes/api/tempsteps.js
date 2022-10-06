const express = require("express");
const router = express.Router();

const { validateEmailInput } = require("../../validation/auth");
const TempStep = require("../../models/TempStep");
const mongoose = require("mongoose");
var multer = require('multer');
const storage = multer.diskStorage(
    {
        destination: './' + process.env.UPLOAD_TEMP_DIR + '/',
    filename: function (req, file, cb) {
            cb( null, file.originalname);
        }
    }
);
const upload = multer( { storage: storage } );

/**
 * Create a new step
 */
router.post("/", upload.array('media'), (req, res) => {
  const { errors, isValid } = validateEmailInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  TempStep.findOne({ email: email })
    .then((result) => {
    if (result) {
      return result.update({
          $set: {
              stepList: JSON.parse(req.body.stepList),
              flowName: req.body.flowName
          }
      })
    } else {
      return new TempStep({
        email: email,
        flowName: req.body.flowName,
        stepList: JSON.parse(req.body.stepList)
      }).save()
    }
  })
  .then(() => {
    return res.json({ success: 'success!!!' })
  })
})

module.exports = router;
