const mongoose = require('mongoose');
const { Schema } = mongoose;

const packageSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  project_id: {
    type: String,
    default: ''
  },
  package: {
    type: String
  },
  image: {
    type: Array
  },
  isPublished: {
    type: Boolean,
    default: 1
  },
  price_eth: {
    type: Number,
    default: 0.0
  },
  description: {
    type: String,
    default: ''
  },
  amount: {
    type: Array
  },
  isBought: {
    type: Boolean,
    default: 0
  },
});
packageSchema.set('timestamps', true);

module.exports = mongoose.model('Packages', packageSchema);
