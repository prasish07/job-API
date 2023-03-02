const express = require("express");
const router = express.Router();

const {
  getAllJobs,
  getJobs,
  createJobs,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

router.route("/").post(createJobs).get(getAllJobs);
router.route("/:id").get(getJobs).delete(deleteJob).patch(updateJob);

module.exports = router;
