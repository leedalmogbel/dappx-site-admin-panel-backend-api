const mongoose = require("mongoose");

const Users = mongoose.model('Users');
const Utils = require('../../common/Utils');

const getUsers = (req, callback) => {
	const offset = parseInt(req.query.offset) || 0;
	const limit = parseInt(req.query.limit) || 10;

	const query = {};

	const queryOr = [];

	const stEmail = req.query.email || '';
	const stPublicAddress = req.query.public_address || '';

	if(stEmail){
		queryOr.push({ email_id: stEmail });
	}

	if(stPublicAddress){
		queryOr.push({ public_address: stPublicAddress });
	}

	if(queryOr.length){
		query['$or'] = queryOr;
	}

	Utils.log('GET_USERS', `Offset: ${offset}, Limit: ${limit}, Filter: ${JSON.stringify(query)}`);

	Users.countDocuments(query)
		.then(usersCount => {
			Users.find(query)
				.sort({ _id: -1 })
				.limit(limit)
				.skip(offset)
				.then(users => {
					const retUsers = [];

					const getUsersInfo = users.map(async (user) => {
						const retUser = {
							email_id: user.email_id,
							public_address: user.public_address,
							referral_by_email: '',
							referral_by_public_address: ''
						};

						if(user.referral_by) {
							await getUserByReferralCode(user.referral_by)
								.then((uplineUser) => {
									retUser.referral_by_email = uplineUser.email_id;
									retUser.referral_by_public_address = uplineUser.public_address;
									retUsers.push(retUser);
								})
								.catch(error => {
									Utils.log('GET_REFERRER_USER', `Error: ${error}`);
								});
						} else {
							retUsers.push(retUser);
						}
					});

					Promise.all(getUsersInfo)
						.then(() => {
							callback(null, {
								total_rows: usersCount,
								users: retUsers
							});
						});
				})
				.catch(error => {
					Utils.log('GET_USERS', `Error: ${error}`);

					callback({
						code: 500,
						message: 'Error fetching list of users'
					}, null);
				});
		})
		.catch(error => {
			Utils.log('GET_USERS_COUNT', `Error: ${error}`);

			callback({
				code: 500,
				message: 'Error fetching list of users'
			}, null);
		});
}

const getUserByReferralCode = (referralCode) => {
	return new Promise((resolve, reject) => {
		Users.findOne({ referral_code: referralCode }, (error, result) => {
			if(error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
}

const getUsersCount = (req, callback) => {
	const query = {};

	Users.countDocuments(query)
		.then(usersCount => {
			callback(null, usersCount);
		})
		.catch(error => {
			Utils.log('GET_USERS_COUNT', `Error: ${error}`);

			callback({
				code: 500,
				message: 'Error fetching number of users'
			}, null);
		});
}

module.exports = {
	getUsers,
	getUsersCount
}