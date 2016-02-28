var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

export const User = mongoose.model('User', new Schema({
  id: ObjectId,
  fname: String,
  lname: String,
  email: {type: String, unique: true},
  password: String,
  created: Date,
  modified: Date
}));

export const Item = mongoose.model('Item', new Schema({
  id: ObjectId,
  userId: ObjectId,
  description: String,
  title: String
}));

export const Look = mongoose.model('Look', new Schema({
  id: ObjectId,
  userId: ObjectId,
  itemIds: Array,
  description: String,
  title: String
}));
