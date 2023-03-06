const { dappstoreAdminUserCheck } = require('../common/auth-middlewares');
const { getUsers, getUsersCount } = require('./modules/user-manager');

const API_BASE_PATH = "/users";
const API_VERSION = "1.0.0";

module.exports = function(server) {
	server.get({
		path: API_BASE_PATH,
		version: API_VERSION
	}, dappstoreAdminUserCheck, _getUsers);

	server.get({
		path: API_BASE_PATH + '/total-users',
		version: API_VERSION
	}, dappstoreAdminUserCheck, _getUsersCount);

	function _getUsers(req, res, next) {
		getUsers(req, (error, result) => {
			if(error) {
				res.send(error.code, { message: error.message });
				return next();
			} else {
				res.send(result);
				return next();
			}
		});
	}

	function _getUsersCount(req, res, next) {
		getUsersCount(req, (error, result) => {
			if(error) {
				res.send(error.code, { message: error.message });
				return next();
			} else {
				res.send({ total_users: result });
				return next();
			}
		});
	}

}