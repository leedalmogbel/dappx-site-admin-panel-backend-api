const { success, fail, validation } = require('../common/response');
const { dappstoreAdminUserCheck } = require('../common/auth-middlewares');
const config = require('../../config/config');
const fs = require('fs');
const path = require('path');
const packageMulter = require('multer');
const {
	getListPackage,
	createPackage,
	getPackageByID,
	updatePackageByID,
	deletePackageByID,
	fetchPackage,
	fetchPackagePriceById,
	updatePackageStatus,
	checkPackageOrder
} = require('./modules/package-manager');

const API_BASE_PATH = '/package';
const API_VERSION = '1.0.0';


const storage = packageMulter.diskStorage({
	filename: function(req, file, callback) {
		const ts = Date.now().toString();
		console.log(file);
		req.on('aborted', () => {
      console.log('Upload canceled by user');
      fs.unlink(`public/images/packages/${timestamp}${file.originalname}`, () => {
        console.log('tetst', `uploads/${timestamp}${file.originalname}`);
      });
    });

		callback(null, path.extname(timestamp + file.originalname));

		// callback(null, new Date().toISOString().replace(/[-T:\.Z]/g, "") + path.extname(file.originalname));
	},
	destination: `${config.root}/public/images/packages`,
	rename: function (fieldname, filename) {
		return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
	},
	onFileUploadStart: function (file) {
			console.log(file.fieldname + ' is starting ...')
	},
	onFileUploadData: function (file, data) {
			console.log(data.length + ' of ' + file.fieldname + ' arrived')
	},
	onFileUploadComplete: function (file) {
			console.log(file.fieldname + ' uploaded to  ' + file.path)
	},
});

const packageUpload = packageMulter({ storage:storage });

module.exports = function(server) {
	server.get({
		path: API_BASE_PATH + `/list`,
		version: API_VERSION
	}, packagesList);

	server.get({
		path: API_BASE_PATH + `/order`,
		version: API_VERSION
	}, packagesCheckOrder);
	
	// endpoint exposed to dappsz
	server.get({
		path: API_BASE_PATH + `/:application/list`,
		version: API_VERSION
	}, packagesDappList);

	server.post({
		path: API_BASE_PATH + `/create`,
		version: API_VERSION
	}, addPackage);

	server.post({
		path: API_BASE_PATH + `/getpackageprice`,
		version: API_VERSION
	}, fetchPackagePrice);

	// endpoint exposed to dappsz
	server.get({
		path: API_BASE_PATH + `/:id`,
		version: API_VERSION
	}, dappstoreAdminUserCheck, getPackage);

	server.put({
		path: API_BASE_PATH + `/update`,
		version: API_VERSION
	}, updatePackage);

	server.put({
		path: API_BASE_PATH + `/publish`,
		version: API_VERSION
	}, dappstoreAdminUserCheck, publishPackage);

	server.del({
		path: API_BASE_PATH + '/:id',
		version: API_VERSION
	}, dappstoreAdminUserCheck, deletePackage);

	// create package
	function addPackage (req, res, next) {
		createPackage(req, (err, result) => {
			if (err) {
				res.send(fail(err.message, res.statusCode));
				return next();
			} else {
				res.send(success('OK', { data: result }, res.statusCode));
				return next();
			}
		});
	};

	// fetch package
	function fetchPackagePrice (req, res, next) {
		fetchPackagePriceById(req, (err, result) => {
			if (err) {
				res.send(fail(err.message, err.status));
				return next();
			} else {
				res.send(success('OK', { data: result }, res.statusCode));
				return next();
			}
		});
	};

	// fetch packages
	function packagesList (req, res, next) {

		getListPackage(req, (err, result) => {
			if (err) {
				res.send(fail(err.message, res.statusCode));
				return next();
			} else {
				res.send(success('OK', { data: result }, res.statusCode));
				return next();
			}
		});
	};

	// check bought packages
	function packagesCheckOrder (req, res, next) {
		checkPackageOrder(req, (err, result) => {
			if (err) {
				res.send(fail(err.message, res.statusCode));
				return next();
			} else {
				res.send(success('OK', { data: result }, res.statusCode));
				return next();
			}
		});
	};

	// serve list to dapp
	function packagesDappList (req, res, next) {
		fetchPackage(req, (err, result) => {
			if (err) {
				res.send(fail(err.message, res.statusCode));
				return next();
			} else {
				res.send(success('OK', { data: result }, res.statusCode));
				return next();
			}
		});
	};

	function getPackage (req, res, next) {
		console.log(req.params)
		getPackageByID(req, (err, result) => {
			if (err) {
				res.send(fail(err.message, res.statusCode));
				return next();
			} else {
				res.send(success('OK', { data: result }, res.statusCode));
				return next();
			}
		});
	};

	function updatePackage (req, res, next) {
		updatePackageByID(req, (err, result) => {
			if (err) {
				console.log('err', err)
				res.send(fail(err, res.statusCode));
				return next();
			} else {
				res.send(success('OK', { data: result }, res.statusCode));
				return next();
			}
		});
	};

	function publishPackage (req, res, next) {
		updatePackageStatus(req, (err, result) => {
			if (err) {
				console.log('err', err)
				res.send(fail(err, res.statusCode));
				return next();
			} else {
				res.send(success('OK', { data: result }, res.statusCode));
				return next();
			}
		});
	}

	function deletePackage (req, res, next) {
		console.log(req.params)
		deletePackageByID(req, (err, result) => {
			if (err) {
				res.send(fail(err.message, res.statusCode));
				return next();
			} else {
				res.send(success('OK', { data: result }, res.statusCode));
				return next();
			}
		});
	};

}
