require('dotenv').config();
const path = require("path");
const rootPath = path.normalize(__dirname + "/..");
const NODE_ENV = process.env.NODE_ENV || "development";
const NODE_HOST = process.env.NODE_HOST || "localhost";
const NODE_PORT = process.env.NODE_PORT || 5000;
const MONGO_HOST = process.env.MONGO_HOST || "localhost";
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_USER = process.env.MONGO_USER || "dappxAdmin";
const MONGO_PASS = process.env.MONGO_PASS || "dappxAdmin123456";
const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const SUPER_ADMIN_EMAIL_ADDRESS = "ceo@decenternet.com";

const APP_NAME = "dappxEngine";

const config = {
	development: {
		env: NODE_ENV,
		root: rootPath,
		adminPanelUrl: "https://admin-panel-dev.pandobrowser.com",
		cryptoApiUrl: "http://localhost:3003",
		pandoApiUrl: "http://localhost:9001",
		orderedPackageURL: "https://dappx-api-sat.dappstore.me/users/getOrdersByPackageID",
		app: {
			name: APP_NAME + NODE_ENV,
			address: NODE_HOST,
			port: NODE_PORT,
		},
		db: {
			host: MONGO_HOST,
			port: MONGO_PORT,
			user: MONGO_USER,
			pass: MONGO_PASS,
			name: `${APP_NAME}-${NODE_ENV}`,
		},
		log: {
			name: APP_NAME + NODE_ENV,
			level: LOG_LEVEL,
		},
		email:{
            host: "smtp.mandrillapp.com",
			port: 587,
			secure: false,
			auth: {
				user: "Dappatoz",
				pass: "Ej9AeUTONCSos04VXqqIJQ",
			},
        },
        superAdminEmailAddress: SUPER_ADMIN_EMAIL_ADDRESS
	},
	sat: {
		env: NODE_ENV,
		root: rootPath,
		adminPanelUrl: "https://admin-panel-sat.pandobrowser.com",
		cryptoApiUrl: "http://localhost:3003",
		pandoApiUrl: "http://localhost:9001",
		dappstoreAdminPanelApiUrl: "https://apiadmin-sat.dappstore.me",
		orderedPackageURL: "https://dappx-api-sat.dappstore.me/users/getOrdersByPackageID",
		app: {
			name: APP_NAME + NODE_ENV,
			address: NODE_HOST,
			port: NODE_PORT,
		},
		db: {
			host: MONGO_HOST,
			port: MONGO_PORT,
			user: MONGO_USER,
			pass: MONGO_PASS,
			name: APP_NAME + NODE_ENV,
		},
		log: {
			name: APP_NAME + NODE_ENV,
			level: LOG_LEVEL,
		},
		email:{
            host: "smtp.mandrillapp.com",
			port: 587,
			secure: false,
			auth: {
				user: "Dappatoz",
				pass: "Ej9AeUTONCSos04VXqqIJQ",
			},
        },
        superAdminEmailAddress: SUPER_ADMIN_EMAIL_ADDRESS
	},
	uat: {
		env: NODE_ENV,
		root: rootPath,
		adminPanelUrl: "https://admin-panel-dev.pandobrowser.com",
		cryptoApiUrl: "http://149.56.44.95:3003",
		pandoApiUrl: "http://localhost:7000",
		dappstoreAdminPanelApiUrl: "https://apiadmin-uat.dappstore.me",
		orderedPackageURL: "https://dappx-api-uat.dappstore.me/users/getOrdersByPackageID",
		app: {
			name: APP_NAME + NODE_ENV,
			address: NODE_HOST,
			port: NODE_PORT,
		},
		db: {
			host: MONGO_HOST,
			port: MONGO_PORT,
			user: MONGO_USER,
			pass: MONGO_PASS,
			name: APP_NAME + NODE_ENV,
		},
		log: {
			name: APP_NAME + NODE_ENV,
			level: LOG_LEVEL,
		},
		email:{
            host: "smtp.mandrillapp.com",
			port: 587,
			secure: false,
			auth: {
				user: "Dappatoz",
				pass: "Ej9AeUTONCSos04VXqqIJQ",
			},
        },
        superAdminEmailAddress: SUPER_ADMIN_EMAIL_ADDRESS
	},
	production: {
		env: NODE_ENV,
		root: rootPath,
		adminPanelUrl: "https://admin-panel.pandobrowser.com",
		cryptoApiUrl: "http://localhost:3003",
		pandoApiUrl: "http://localhost:9000",
		dappstoreAdminPanelApiUrl: "https://apiadmin.dappstore.me",
		orderedPackageURL: "https://dappx-api.dappstore.me/users/getOrdersByPackageID",
		app: {
			name: APP_NAME + NODE_ENV,
			address: NODE_HOST,
			port: NODE_PORT,
		},
		db: {
			host: MONGO_HOST,
			port: MONGO_PORT,
			user: MONGO_USER,
			pass: MONGO_PASS,
			name: APP_NAME + NODE_ENV,
		},
		log: {
			name: APP_NAME + NODE_ENV,
			level: LOG_LEVEL,
		},
		email:{
            host: "smtp.mandrillapp.com",
			port: 587,
			secure: false,
			auth: {
				user: "Dappatoz",
				pass: "Ej9AeUTONCSos04VXqqIJQ",
			},
        },
        superAdminEmailAddress: SUPER_ADMIN_EMAIL_ADDRESS
	},
}

module.exports = config[NODE_ENV];