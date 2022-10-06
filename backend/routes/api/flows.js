const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth");
const { validateFlowInput } = require("../../validation/flows");
const Flow = require("../../models/Flow");

/**
 * List Saved flows
 */
router.get("/", authMiddleware, async (req, res) => {
  const user = req.user;
  const flows = await Flow.find({ user: user._id, link: { $not: { $eq: '' } } });

  return res.json({ flows });
});
 
router.get("/clear", authMiddleware, async (req, res) => {
  const user = req.user;
  await Flow.deleteMany({ user: user._id });
  return res.json({msg: 'Successfully cleared!'})
})
/**
 * Get a flow by id
 */
router.get("/:flowId", authMiddleware, async (req, res) => {
  const flow = await Flow.findById(req.params.flowId);
  if (flow) {
    return res.json({ flow });
  }
  else {
    return res.status(404).json({ message: 'Flow not found' });
  }
});

// router.get("/getFlowByName", authMiddleware, async (req, res) => {
//   console.log("!!!!!!!!!", req.body);
//   const flow = await Flow.findOne({ name: req.body.name });
//   if (flow) {
//     return res.json({ flow });
//   }
//   else {
//     return res.status(404).json({ message: 'Flow not found' });
//   }
// });

/**
 * Create a new flow
 */
router.post("/create", authMiddleware, async (req, res) => {
  // Flow input validation
  const { errors, isValid } = validateFlowInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const user = req.user;
  const new_flow = await Flow.create({
    user: user._id,
    name: req.body.name
  });

  return res.json({ new_flow });

});

router.get("/checkFlow/:flowName", authMiddleware, async (req, res) => {
  // Flow input validation
  const flow = await Flow.find({ name: req.params.flowName });
  if (flow) {
    return res.json({ flow });
  }
  else {
    return res.status(404).json({ message: 'Flow not found' });
  }

});

/**
 * Update a flow
 */
router.put("/update/:flowId", authMiddleware, async (req, res) => {
  // Flow input validation
  const { errors, isValid } = validateFlowInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const flow = await Flow.findById(req.params.flowId);
  if (flow) {
    const updatedFlow = await Flow.findByIdAndUpdate(req.params.flowId, { name: req.body.name, link: req.body.link }, { new: true });
    return res.json({ flow: updatedFlow });
  }
  else {
    return res.status(404).json({ message: 'Flow not found' });
  }
});

router.delete("/delete/:flowId", authMiddleware, async (req, res) => {
  const flow = await Flow.findById(req.params.flowId);
  if (flow) {
    await Flow.findByIdAndRemove(
      req.params.flowId,
    );
    return res.json({ message: "Flow was succesfully deleted!" });
  } else {
    return res.status(404).json({ message: "Flow not found" });
  }
});

module.exports = router;
