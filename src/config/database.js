
const mongoose = require("mongoose");

const connectDB = async() => {
    await mongoose.connect("mongodb+srv://yadavlalu5252:lalu123@cluster0.owaohpy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
};

module.exports = connectDB;