const Project = require('../../models/project');
const config = require('../../../config/config');
const moment = require('moment');
require('dotenv').config();

const getProjectList = async (req, callback) => {
  let projectList = [];
  try {
    projectList  = await Project.find({}).sort({ createdAt: -1 });
  } catch (error) {
    console.log(error)
    callback(true, null);
  }
   
  const data = {
    project: projectList,
  };
  callback(null, data);
};

const createProject = (req, callback) => {
  const { name } = req.body;

  const res = new Project({ name });
	res.save().then((result) => {
		callback(null, result);
	}).catch(error => {
		log.error(`Error adding to projecy - ${error}`);
		callback(error, null);
	});
}

const updateProject = (req, callback) => {
  const { name } = req.body;

  const res = new Project({ name });
	res.save().then((result) => {
		callback(null, result);
	}).catch(error => {
		log.error(`Error adding to projecy - ${error}`);
		callback(error, null);
	});
}

module.exports = {
  getProjectList,
  createProject,
  updateProject,
  // deleteProjectById
};