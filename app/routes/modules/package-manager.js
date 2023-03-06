const Package = require('../../models/package');
const config = require('../../../config/config');
const fs = require('fs');
const moment = require('moment');
const path_ = require('path');
const axios = require('axios');
require('dotenv').config();

const getListPackage = async (req, callback) => {
  let perPage = parseInt(req.query.limit) || 10; // page size
  let page = parseInt(req.query.offset);
  let sort_ = req.query.sort || 'createdAt';
  let orderBy = req.query.orderBy === 'asc' ? 1 : -1;

  let search = req.query.search || {};
  let filter = req.query.filter;
  let from = req.query.from;
  let to = req.query.to;
  let packageList = {};
  let packageTotal = {};

  if (sort_ === 'price') {
    sort_ = 'amount.amount';
  }

  let now = new Date();
  if (!from) {
    from = new Date(parseFloat(moment("01/01/2021 04:00", "M/D/YYYY H:mm").unix()))
    to = new Date(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - 1)
    console.log('from', from)
    console.log('to', to)
  } else {
    from = new Date(parseFloat(from))
    to = new Date(parseFloat(to))
    // from = from ? new Date(parseFloat(from)) : new Date(parseFloat(moment("01/01/2021 04:00", "M/D/YYYY H:mm").unix()));
    // to = to ? new Date(parseFloat(to)) : new Date(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - 1);
    from = new Date(from.getFullYear(), from.getMonth(), from.getDate() - 1, 16, 0, 0 , 0);
    console.log('from', from);

    to = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 15, 59, 59, 59);
    console.log('to', to);
  }

  if (filter) {
    filter = filter.split(',');
    try {
      packageList  = await Package.find({
        $and: [{
          name: { $in: filter },
          createdAt: {
            $gte: from,
            $lte: to
          }
        }]
      })
      .collation({ locale: 'en_US', numericOrdering: true })
      .sort({ [sort_]: orderBy })
      .skip(page)
      .limit(perPage);

      packageTotal = await Package.countDocuments({
        $and: [{
          name: { $in: filter },
          createdAt: {
            $gte: from,
            $lte: to
          }
        }]
      });
  
    } catch (error) {
      console.log(error)
      callback(true, null);
    }
  } else {
    console.log('new Date(from).toISOString()', new Date(from).toISOString());
    try {
      packageList  = await Package.find({
        '$and': [{
          '$or': [
            { 'name': { '$regex': '.*' + search + '.*', '$options': 'i' } },
            { 'package': { '$regex': '.*' + search + '.*', '$options': 'i' } },
          ],
          createdAt: {
            $gte: from,
            $lte: to
          }
        },
        ]
      })
      .sort({ [sort_]: orderBy })
      .collation({ locale: 'en_US', numericOrdering: true })
      .limit(perPage)
      .skip(page);

      packageTotal = await Package.countDocuments({
        $and: [{
          $or: [
            { name: { $regex: '.*' + search + '.*', $options: 'i' } },
            { package: { $regex: '.*' + search + '.*', $options: 'i' } },
          ],
          createdAt: {
            $gte: from,
            $lte: to
          }
        },
        ]
      });

    } catch (error) {
      console.log(error)
      callback(true, null);
    }

  }
  const totalPages = Math.ceil(packageTotal / perPage)
  const currentPage = Math.ceil(packageTotal % page)
  
  const data = {
    package: packageList,
    total_rows: packageTotal,
    total_pages: totalPages
  };
  callback(null, data);
};

const createPackage = async (req, callback) => {
  const { name, package, isPublished, price_eth, project_id, description, amount } = req.body;
  let avatar = [];
  let coins = [];

  if (amount) {
    coins = JSON.parse(amount);
    coins[0].amount = parseFloat(coins[0].amount);
    console.log('coins', coins)
  }

  if (req.files.file) {
    avatar = req.files.file;
    let fileSize = (avatar.size / 1024 / 1024);
    if (fileSize > 100) {
      return callback({ message: 'File was rejected. File is too big. Size limit is 100 megabytes.'}, null);
    }
    console.log(avatar.size, (avatar.size / 1024 / 1024))
    imagePath = `${config.root}/public/images/packages/`;
    const image = uploadImage(req, imagePath);
    avatar.path = image.substring(image.indexOf('images'), image.length);
  }

  const res = new Package({ name, package, isPublished, price_eth, image: avatar, project_id, description, amount: coins });
	res.save().then((result) => {
		// log.info(`${name} added to package db`);
		callback(null, result);
	}).catch(error => {
		log.error(`Error adding to package - ${error}`);
		callback(error, null);
	});
}

const getPackageByID = async (req, callback) => {
  let id = req.params.id;

  try {
    const package  = await Package.findOne({ _id:id });
    // let image = '';
    // if (package.image) {
    //   image = `${process.env.BASE_URL}/${package.image[0].path}`;
    //   // package.image = image.toString();
    // }

    let pckg = {
      package_id: package._id,
      project_id: package.project_id,
      price_eth: package.price_eth,
    };

    callback(null, pckg);
  } catch (error) {
    console.log(error)
    callback(true, null);
  }
};

const updatePackageByID = async (req, callback) => {
  const id = req.body.id;
  let query = req.body;
  let oldPath = req.body.oldPath ? `public/${req.body.oldPath}` : null; // require old path for lessen db calls
  let avatar = req.files.file ? req.files.file:[];

  let coins = {};
  if (req.body.amount) {
    console.log(req.body)
    coins = JSON.parse(req.body.amount);
    coins[0].amount = parseFloat(coins[0].amount);
    console.log('coins', coins)
  }

  if (avatar && avatar.size > 0) {

    imagePath = `${config.root}/public/images/packages/`;
    let fileSize = (avatar.size / 1024 / 1024);
    if (fileSize > 100) {
      return callback({ message: 'File was rejected. File is too big. Size limit is 100 megabytes.'}, null);
    }
    const image = uploadImage(req, imagePath);
    avatar.path = image.substring(image.indexOf('images'), image.length);

    if (oldPath) {
      removeOldImage(oldPath);
    }

    delete query.id;
    query = {
      ...query,
      image: avatar,
      amount: coins
    }
  } else {
    query = {
      ...query,
      amount: coins
    }

    delete query.image;
    if (req.body.file === 'undefined' && req.body.oldImageRemove === 'true') {
      query = {
        ...query,
        image: avatar
      };

      if (oldPath) {
        removeOldImage(oldPath);
      }
    }
  }

  try {
    const package = await Package.findByIdAndUpdate(id, query, { new: true });
    if (!package) callback('Not Found', null);

    callback(null, package);
  } catch (error) {
    console.log('error', error)
    callback(error, null);
  }
};

const updatePackageStatus = async (req, callback) => {
  const id = req.body.id;
  let query = req.body;

  try {
    const package = await Package.findByIdAndUpdate(id, query, { new: true });
    if (!package) callback('Not Found', null);

    callback(null, package);
  } catch (error) {
    console.log('error', error)
    callback(error, null);
  }
};

const deletePackageByID = async (req, callback) => {
  const id = req.params.id;

  try {
    const package  = await Package.findByIdAndDelete(id);
    callback(null, package);
  } catch (error) {
    console.log(error)
    callback(true, null);
  }
};

const checkPackageOrder = async (req, callback) => {
  let packageList  = await Package.find({ });

  packageList.map(async (package) => {
    let isBought = 0;
    const boughtOrder = await axios.post(`${config.orderedPackageURL}`, { package_id: package._id, accesstoken: '0C3KB70CTC'})

    //console.log(boughtOrder.data)
    //console.log('boughtOrder.data.orders.length', boughtOrder.data.orders.length)
    if (boughtOrder.data.orders.length > 0){
      isBought = 1;
    }
    await Package.findByIdAndUpdate(package._id, { isBought }, { new: true });
  });

  callback(null, packageList);
};

const fetchPackagePriceById = async (req, callback) => {
  const { project_id, package_id } = req.body;
  try {
    const package  = await Package.findOne({
      $and: [
          { project_id: project_id },
          { _id: package_id }]
    })
    .sort({ createdAt: -1 });

    if (!package) {
      return callback({ message: 'project id or package id doesnt exist', status: '404' }, null);
    }

    let amount = package.amount;

    let price = {};
    amount.forEach((val) => {
      price[val.currency] = {};
      price[val.currency].amount = val.amount;
    });

    callback(null, { price });
  } catch (error) {
    console.log(error)
    callback(error, null);
  }
}

const fetchPackage = async (req, callback) => {
  let perPage = parseInt(req.query.limit) || 10; // page size
  let page = parseInt(req.query.offset);
  let search = req.query.search || {};
  let filter = req.query.filter;
  let packageList = {};
  let packageTotal = {};
  let app = req.params.application || {};

  if (!app) {
    return callback({ message: 'App name doesnt exists.'}, null);
  }

  try {
    packageList  = await Package.find({
      $and: [{
        $or: [
          { name: app },
          { project_id: app },
        ],
        isPublished: true ,
      }]
    })
    .sort({ createdAt: -1 })
    .limit(perPage)
    .skip(page);

    packageTotal = await Package.countDocuments({
      $and: [
          { name: app },
          { isPublished: true },
        ],
    });

  } catch (error) {
    console.log(error)
    callback(error, null);
  }

  packageList = packageList.map((package) => {
    let imagePath = '';
    if (package.image.length !== 0) {
      imagePath = `${process.env.BASE_URL}/${package.image[0].path}`;
    }
    package.image = imagePath;
    return package;
  });
  const totalPages = Math.ceil(packageTotal / perPage)

  const data = {
    package: packageList,
    total_rows: packageTotal,
    total_pages: totalPages
  };
  callback(null, data);
};

const uploadImage = (req, path) => {
  const tmpPath = req.files.file.path;
  console.log('tmpPath', req.files.file.path)
  const fileName = Date.now() + req.files.file.name;

  const targetPath = path + fileName;
  fs.rename(tmpPath, targetPath, function(err) {
    if (err) throw err;
    fs.unlink(tmpPath, function() {
      if (err) {
        throw err;
      } else {
        let img = fileName;
      };
    });
  });

  return targetPath;
};

const removeOldImage = (path) => {
  const appDir = path_.dirname(require.main.filename);
  const targetPath = `${appDir}/${path}`;
  fs.unlink(targetPath, function(err) {
    if (err) {
      console.log('error:', err);
      throw err;
    } else {
      console.log('success remove');
    };
  });
};

module.exports = {
  getListPackage,
  createPackage,
  getPackageByID,
  updatePackageByID,
  deletePackageByID,
  fetchPackage,
  fetchPackagePriceById,
  updatePackageStatus,
  checkPackageOrder
};