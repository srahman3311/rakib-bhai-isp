const mongoose = require("mongoose");




const adminSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    joiningDate: {
        type: String,
        required: true
    }
});

// For Search Functionality
//adminSchema.index({'$**': 'text'});
adminSchema.index({"$**": "text"});

// Model
const Admin = mongoose.model("Admin", adminSchema);









module.exports = Admin;