const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs"); // Needed For User Password Checking
const mongoose = require("mongoose"); // Needed For Using Model

const Admin = require("../models/Admin");


module.exports = function(passport) {
    passport.use(
        new LocalStrategy((username, password, done) => {
            
            // Match Admin
            Admin.findOne({username: username}, (err, admin) => {

                if(err) return done(err);

                if(!admin) {
                    return done(null, false, {message: "this admin is not registered"});
                }

                // Match Password
                bcrypt.compare(password, admin.password, (err, isMatch) => {

                    if(!err) {

                        if(isMatch) {

                            return done(null, admin);

                        } else {

                            return done(null, false, {message: "Passwords don't match"});
                        }
                    }
                   
                });
                
            });
        })
    );

    passport.serializeUser((admin, done) => {

        done(null, admin._id);

    });
      
    passport.deserializeUser((id, done) => {

        Admin.findById(id, (err, admin) => {

          done(err, admin);
          
        });
    });
};
