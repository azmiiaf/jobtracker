const express = require("express");
const router = express.Router();
const {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  updateApplicationStatus,
  updateApplicationInterview,
  deleteApplication,
} = require("../controllers/applicationController");
const { protect } = require("../middlewares/authMiddleware");

router.use(protect);

// List & Create Applications
router.get("/", getApplications);
router.post("/", createApplication);

// Detail, Update Status, & Delete Application
router.get("/:id", getApplicationById);
router.put("/:id", updateApplication);
router.patch("/:id/status", updateApplicationStatus);
router.put("/:id/interview", updateApplicationInterview);
router.delete("/:id", deleteApplication);

module.exports = router;
