const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
    email: {type: String},
    user_id: {
        type: String, 
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    cellphone: {
        type: String, 
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    connection_type: {
        type: String,
        required: true
    },
    bought_package: {
        type: String,
        required: true
    },
    billing: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

userSchema.index({"$**": "text"});


const User = mongoose.model("User", userSchema);





module.exports = User;