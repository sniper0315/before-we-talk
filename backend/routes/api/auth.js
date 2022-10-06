const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { CourierClient } = require("@trycourier/courier");

const keys = require("../../config/keys");
const courierConfig = require("../../config/courier");
const authMiddleware = require("../../middlewares/auth");
const { validateEmailInput } = require("../../validation/auth");
const User = require("../../models/User");
const TempStep = require("../../models/TempStep");

/**
 * Send Confirmation email via Courier to verify your email
 */
router.post("/sendConfirmEmail", async (req, res) => {
  // Email validation
  const { errors, isValid } = validateEmailInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const url = req.body.url;

  // Compute unique token
  const confirmationCode = jwt.sign({ email }, keys.emailConfirmSecret, { expiresIn: 1200 });

  // Generate auth url
  const authUrl = new URL(url);
  authUrl.searchParams.set('confirmationCode', confirmationCode);

  // Send confirmation email via Courier
  const courier = CourierClient({ authorizationToken: courierConfig.auth_token });

  const { requestId } = await courier.send({
    message: {
      to: {
        email,
      },
      template: courierConfig.template,
      data: {
        auth_url: authUrl,
      },
    },
  });

  if (requestId) {
    return res.json({ status: true, message: 'success', confirmationCode });
  }
  else {
    return res.json({ status: false, message: 'Sending email failed' });
  }
});

/**
 * Confirm your email
 */
router.get('/confirm/:confirmationCode', async (req, res) => {
  console.log('teset')
  try {
    const decode = jwt.verify(req.params.confirmationCode, keys.emailConfirmSecret);
    if (decode && decode.email) {
      console.log(decode.email)
      // Insert or Update user with email and confirmation code
      let user = await User.findOne({ email: decode.email });
      console.log(decode.email)
      let tempStep = await TempStep.findOne({ email: decode.email });

      if (!user) {
        user = await User.create({
          email: decode.email,
          name: decode.email.split('@')[0],
          lastLoginTime: new Date(),
          lastLoginTimeAhead: new Date(Date.now() + 1000 * 3600)
        })
      } else {
        console.log(';---')
        await User.updateOne({ email: decode.email }, { lastLoginTime: new Date(), lastLoginTimeAhead: new Date(Date.now() + 1000 * 3600) })
        console.log(';+++')
      }

      const signedUser = {
        _id: user.id,
        email: user.email,
        name: user.name,
        meeting: user.meeting,
        avatar: user.avatar
      };
      const temp = tempStep ? {
        email: tempStep.email,
        stepList: tempStep.stepList,
        flowName: tempStep.flowName
      } : tempStep;
      // await TempStep.find({
      //   _id: tempStep._id
      // }).update({
      //   $set: {
      //     stepList: [],
      //     flowName: ''
      //   }
      // })
      // JWT authentication with access token and refresh token
      const accessToken = jwt.sign(signedUser, keys.accessSecret, { expiresIn: 86400 });
      const refreshToken = jwt.sign(signedUser, keys.refreshSecret, { expiresIn: 864000 });

      return res.json({
        status: true,
        userData: signedUser,
        accessToken,
        refreshToken,
        tempStep: temp
      });
    }
    else {
      res.status(500).send({ status: false, message: "Invalid Authorization" });
    }
  } catch (error) {
    console.log('error', error);
    return res.status(500).send({ status: false, message: "Invalid Authorization" });
  }
});

/**
 * Log out
 */
router.get('/logout', authMiddleware, async (req, res) => {
  return res.json({ status: true, message: 'Logged Out' })
});

/**
 * Get account settings
 */
router.get('/user', authMiddleware, async (req, res) => {
  const user = req.user;
  return res.json({ status: true, user });
});

/**
 * Update account settings
 */
router.post('/user/update', authMiddleware, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
  return res.json({ status: true, user });
});

module.exports = router;
