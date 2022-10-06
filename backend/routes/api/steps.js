const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth");
const { validateStepInput } = require("../../validation/steps");
const Step = require("../../models/Step");
const Flow = require("../../models/Flow");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

/**
 * Get steps by flow id
 */
router.get("/getByFlowId/:flowId", authMiddleware, async (req, res) => {
  const steps = await Step.find({ flow: mongoose.Types.ObjectId(req.params.flowId) }).populate('user');

  return res.json({ steps });
});

/**
 * Get a step by id
 */
router.get("/getByStepId/:stepId", authMiddleware, async (req, res) => {
  const step = await Step.findById(req.params.stepId);
  if (step) {
    return res.json({ step });
  }
  else {
    return res.status(404).json({ message: 'Step not found' });
  }
});

/**
 * Get default step list
 */
router.get("/getDefaultSteps/:reqeustFrom", async (req, res) => {
  const adminFlow = await Flow.findOne({ name: 'admin' }).populate('user');
  if (adminFlow && adminFlow.user.email === process.env.ADMIN_ACCOUNT) {
    const steps = await Step.find({ flow: adminFlow._id }).populate('user');

    return res.json({ steps });
  } else {
    return res.json({ steps: [] })
  }
  // const steps = await Step.find({ type: 'default' });
  // const user = req.user;
  // // if (user.)
  // console.log('---', req.params)
  // if (req.params.reqeustFrom == 'conversation' && req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
  //   try {
  //     const decode = jwt.verify(req.headers.authorization.split(' ')[1], keys.accessSecret);
  //     if (decode) {
  //       req.user = decode;
  //       return res.json({steps: []})
  //     }
  //   }
  //   catch (error) {
  //     console.log('error', error);
  //   }
  // }
  
  // return res.json({ steps });
});

router.get("/usedLinks/:stepType", authMiddleware, async (req, res) => {
  const step = await Step.find({ stepType: req.params.stepType, user: req.user._id });
  if (step) {
    return res.json({ step });
  }
  else {
    return res.status(404).json({ message: 'Step not found' });
  }
});

/**
 * Create a new step
 */
router.post("/create", authMiddleware, async (req, res) => {
  // Step input validation
  req.body.stepArray.forEach((item, index) => {
    const { errors, isValid } = validateStepInput(item);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  })

  console.log(req.body)
  if (req.body.type === 'default') {
    await Step.deleteMany({ type: 'default' })
  }
  const resultArray = Promise.all(req.body.stepArray.map(async (step, index) => {
    const user = req.user;
    const result = await Step.create({
      user: user._id,
      flow: mongoose.Types.ObjectId(step.flow),
      stepNumber: step.stepNumber,
      stepType: step.stepType,
      content: step.content,
      description: step.description ? step.description : '',
      type: step.type ? step.type : null
    });
    return result
  }))


  resultArray.then((resA) => {
    return res.json({ resA });
  });
})


/**
 * Update a step
 */
router.put("/update/:stepId", authMiddleware, async (req, res) => {
  // Step input validation
  const { errors, isValid } = validateStepInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const step = await Step.findById(req.params.stepId);
  if (step) {
    const updatedStep = await Step.findByIdAndUpdate(
      req.params.stepId,
      {
        flow: mongoose.Types.ObjectId(req.body.flow),
        stepNumber: req.body.stepNumber,
        stepType: req.body.stepType,
        content: req.body.content,
        description: req.body.description ? req.body.description : ''
      },
      { new: true }
    );
    return res.json({ step: updatedStep });
  }
  else {
    return res.status(404).json({ message: 'Step not found' });
  }
});

module.exports = router;
