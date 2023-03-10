const Utils = {};
const aesjs = require('aes-js');
const pbkdf2 = require('pbkdf2');

const hash = require('object-hash');
const uuid = require('uuid');
const axios = require('axios');

Utils.log = function (tag, message) {
    const date = new Date().toISOString();
    console.log(`${date} [${tag}] ${message}`);
}

Utils.isEmpty = function (str) {
    return !str || str.trim() == '';
}

const getKey = function(password, salt) {
    return pbkdf2.pbkdf2Sync(password, salt, 1, 256 / 8, 'sha512');
}

Utils.encryptString = function (password, salt, hexString) {
    var key = getKey(password, salt);
    var textBytes = aesjs.utils.utf8.toBytes(hexString);
    var aesCtr = new aesjs.ModeOfOperation.ctr(key);
    var encrypted = aesCtr.encrypt(textBytes);
    return {
        hex: aesjs.utils.hex.fromBytes(encrypted),
    };
}
 
Utils.decryptString = function (password,salt, hexString) {
    var key = getKey(password, salt);
    var encryptedBytes = aesjs.utils.hex.toBytes(hexString);
    var aesCtr = new aesjs.ModeOfOperation.ctr(key);
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);
    return aesjs.utils.utf8.fromBytes(decryptedBytes);
}

const apiUrls = [
];

Utils.generateAndSendKeyPair = (envi, callback) => {
    const pandoApi = apiUrls[envi].pandoApi;
    const adminPanelApi = apiUrls[envi].adminPanelApi;
    const cryptoApi = apiUrls[envi].cryptoApi;

    console.log(pandoApi, adminPanelApi, cryptoApi);

    //generate key pair
    const key = hash({ envi, date: new Date(), randomValue: Math.random(), uuid: uuid.v4() });
    const salt = hash({ envi, date: new Date(), randomValue:  Math.random(), uuid: uuid.v4() });

    //send key pair
    const pandoApiRequest = axios.post(pandoApi, { password: key, salt: salt });
    const adminPanelApiRequest = axios.post(adminPanelApi, { password: key, salt: salt });
    const cryptoApiRequest = axios.post(cryptoApi, { password: key, salt: salt });

    axios.all([pandoApiRequest, adminPanelApiRequest, cryptoApiRequest])
        .then(result => {
            console.log('Generated Key Pair sent to API servers');
            callback(null, true);
        })
        .catch(error => {
            console.log(error);
            callback({
                code: 500,
                message: 'Error generating key pair'
            }, null);
        });
}

module.exports = Utils;