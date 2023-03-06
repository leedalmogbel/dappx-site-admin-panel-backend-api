const { success, fail, validation } = require('../common/response');
const { dappstoreAdminUserCheck } = require('../common/auth-middlewares');

const {
	getProjectList,
	createProject,
	updateProject
} = require('./modules/project-manager');

const API_BASE_PATH = '/project';
const API_VERSION = '1.0.0';

module.exports = function(server) {
	server.get({
		path: API_BASE_PATH + `/list`,
		version: API_VERSION
	}, projectList);

	server.post({
		path: API_BASE_PATH + `/create`,
		version: API_VERSION
	}, addProject);

	server.put({
		path: API_BASE_PATH + `/:id`,
		version: API_VERSION
	}, editProject);

	// server.del({
	// 	path: API_BASE_PATH + '/:id',
	// 	version: API_VERSION
	// }, deleteProject);

	// create project
	function addProject (req, res, next) {
		createProject(req, (err, result) => {
			if (err) {
				res.send(fail(err.message, res.statusCode));
				return next();
			} else {
				res.send(success('OK', { data: result }, res.statusCode));
				return next();
			}
		});
	};

	// fetch projects
	function projectList (req, res, next) {
		getProjectList(req, (err, result) => {
			if (err) {
				res.send(fail(err.message, res.statusCode));
				return next();
			} else {
				res.send(success('OK', { data: result }, res.statusCode));
				return next();
			}
		});
	};

	// edit project
	function editProject (req, res, next) {
		updateProject(req, (err, result) => {
			if (err) {
				res.send(fail(err.message, res.statusCode));
				return next();
			} else {
				res.send(success('OK', { data: result }, res.statusCode));
				return next();
			}
		});
	};

	// delete project
	// function deleteProject (req, res, next) {
	// 	deleteProjectById(req, (err, result) => {
	// 		if (err) {
	// 			res.send(fail(err.message, res.statusCode));
	// 			return next();
	// 		} else {
	// 			res.send(success('OK', { data: result }, res.statusCode));
	// 			return next();
	// 		}
	// 	});
	// };

}
