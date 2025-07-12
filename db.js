const mongoose = require("mongoose");

const schema = mongoose.schema;
const ObjectId = schema.ObjectId;

const User = new schema({
    name: String,
    email: String,
    password: String
});

const Todo = new schema({
    userId: ObjectId,
    title: String,
    password:String

});


