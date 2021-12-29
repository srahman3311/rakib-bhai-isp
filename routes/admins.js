const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const {ensureAuthentication} = require("../config/auth");

const router = express.Router();

const Admin = require("../models/Admin");


// Dashboard Route
router.get("/dashboard", ensureAuthentication, (req, res) => {
    let name = req.user.fname + " " + req.user.lname;
    res.render("dashboard", {name: name});
});


// Getting All Admin Data
router.get("/admin-list", (req, res) => {
    
    Admin.find({}, (err, admins) => {

        if(err) throw err;
    
        res.render("admin-list", {admins});

    });
});


// Getting Queried Admin/Admins
router.post("/admin-list", (req, res) => {
    Admin.find({$text: {$search: req.body.searchValue}}).exec((err, admins) => {

        if(err) throw err;

        res.render("admin-list", {admins});

    });
});










// Route For Getting Individual Admin Details
router.get("/single-admin/:id", (req, res) => {
    Admin.findOne({_id: req.params.id}, (err, admin) => {
        res.render("single-admin", {admin: admin});
    });
});






// Changing Admin Status From Active To Inactive And Vice Versa
router.post("/change-status/:id", (req, res) => {
    Admin.findOne({_id: req.body.admin}, (err, admin) => {
        if(admin.status === "active") {
            admin.status = "inactive";
            admin.save(err => {
                if(!err) {
                    res.redirect("/admins/single-admin/" + req.params.id);
                }
            });
        } else {
            admin.status = "active";
            admin.save(err => {
                if(!err) {
                    res.redirect("/admins/single-admin/" + req.params.id);
                }
            });

        }
    });
});


// Admin Get Routes
router.get("/add-admin", (req, res) => {
    res.render("add-admin");
});



//Logout Route
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/admins/login");
});



//Admin Post Routes
router.post("/add-admin", (req, res) => {
   
    const {fname, lname, email, username, password, password2, joiningDate} = req.body;   
    
    let errors = [];

    if(!fname) {
        errors.push({msg: "first name is required"});
    }

    if(!lname) {
        errors.push({msg: "last name is required"});
    }

    if(!username) {
        errors.push({msg: "username is required"});
    }

    if(!password) {
        errors.push({msg: "password is required"});
    }

    if(password.length < 8) {
        errors.push({msg: "password must be at least 8 characters long"});
    }

    if(!password2) {
        errors.push({msg: "confirmation password is also required"});
    }

    if(password !== password2) {
        errors.push({msg: "passwords didn't match"});
    }


   
   if(errors.length > 0) {
       res.render("add-admin", {errors: errors});
   } else {
        let adminDetails;

        if(email !== "") {
            adminDetails = {fname, lname, username, email, password, status: "active", joiningDate};
        } else {
            adminDetails = {fname, lname, username, password, status: "active", joiningDate};
        }

        Admin.findOne({username: username}, (err, admin) => {
            if(admin) {
                errors.push({message: "admin already exists, please log in"});
                res.render("add-admin", {errors});
            } else {
                const admin = new Admin(adminDetails);

                bcrypt.genSalt(10, (err, salt) => {
                    if(!err) {
                        bcrypt.hash(admin.password, salt, (err, hash) => {
                            admin.password = hash;
            
                            admin.save(err => {
                                if(!err) {
                                    req.login(admin, err => {
                                        if(!err) return res.redirect("/admins/dashboard");
                                    });
                                }
                            });
                        });
                    }
                   
                });
            }
        });

       

   }
   
});

router.get("/login", (req, res) => {
    res.render("login");
});


router.post("/login", (req, res, next) => {
    passport.authenticate("local", 
    {
        successRedirect: "/admins/dashboard", 
        failureRedirect: "/admins/login"
    }) (req, res, next);
});


module.exports = router;