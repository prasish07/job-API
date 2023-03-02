const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({
    createdBy: req.user.userID,
  }).sort("createdAt");
  // console.log(jobs);
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
const getJobs = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findOne({ _id: id, createdBy: req.user.userID });
  if (!job) {
    throw new NotFoundError(`No job with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ job });
};
const createJobs = async (req, res) => {
  req.body.createdBy = req.user.userID;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};
const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userID },
    params: { id: jobId },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("company or position fields cannot be empty");
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userID },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`No job with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ job });
};
const deleteJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobId },
  } = req;
  const job = await Job.findByIdAndRemove({ _id: jobId, createdBy: userID });
  if (!job) {
    throw new NotFoundError(`No job with id ${id}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllJobs,
  getJobs,
  createJobs,
  updateJob,
  deleteJob,
};
