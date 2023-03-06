const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
});

projectSchema.set('timestamps', true);

module.exports = mongoose.model('Project', projectSchema);
