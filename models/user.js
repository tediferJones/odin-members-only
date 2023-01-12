const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
  firstName: { type: String, maxLength: 32, required: true },
  lastName: { type: String, maxLength: 32 },
  email: { type: String, required: true },
  password: { type: String, minLength: 8, required: true },
  membershipStatus: { type: Boolean },
  adminStatus: { type: Boolean }
});

module.exports = mongoose.model('User', UserSchema);