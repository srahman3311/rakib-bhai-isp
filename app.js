require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

const app = express();

// Authentiction Middleware
require("./config/local-auth")(passport);


// Middlewares
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended: true}));

// View Engine
app.set("view engine", "ejs");

// Session
app.use(session({
    secret: 'ubaidrahman',
    resave: false,
    saveUninitialized: true,
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());







// Database Connection With Mongoose
const uri = process.env.URI;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
const conn = mongoose.connection;

conn.once("open", () => console.log("Database connected"));




// Routes
app.use("/", require("./routes/home-routes"));
app.use("/users", require("./routes/users"));
app.use("/admins", require("./routes/admins"));






// Server & PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));