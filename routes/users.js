const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");

//const months = require("../calculations/month");
//const years = require("../calculations/years");
const time = require("../calculations/time");

const router = express.Router();




//Getting All Users
router.get("/user-list", (req, res) => {

    User.find({}, (err, users) => {

        if(err) throw err;

        if(!users) {
            res.redirect("/users/add-user");
        } 
        else {
            res.render("user-list", {users, years: time.getYears(), months: time.months});
        }
    });
});


// Getting Queried User/Users
router.post("/user-list", (req, res) => {
  
    User.find({$text: {$search: req.body.searchValue}}).exec((err, users) => {

        if(err) throw err;

        res.render("user-list", {users, years: time.getYears(), months: time.months});
        
    });
});



//Getting A Single User
router.get("/user/:id", (req, res) => {

    

    User.findOne({_id: req.params.id}, (err, user) => {
        if(!err) {
            res.render("user", {user, years: time.getYears(), months: time.months});
        }
        
    });
});












// Updating User Status
router.post("/change-status/:id", (req, res) => {
    User.findOne({_id: req.body.user}, (err, user) => {
        if(user.status === "active") {
            user.status = "inactive";
            user.save(err => {
                if(!err) {
                    res.redirect("/users/user/" + req.params.id);
                }
            });
        } else {
            user.status = "active";
            user.save(err => {
                if(!err) {
                    res.redirect("/users/user/" + req.params.id);
                }
            });

        }
    });
});
















let errors = [];
router.get("/add-user", (req, res) => {

   
    res.render("add-user", {years: time.getYears(), months: time.months, errors});
    errors = [];
});

router.post("/add-user", (req, res) => {

    //console.log(req.user);

    const {
        connectiontType,
        fname,
        lname,
        username,
        email,
        cellphone,
        house_street,
        city,
        zipCode,
        gender,
        package,
        month,
        year,
        amount,
        comments
    } = req.body;

    if(!connectiontType) {
        errors.push({message: "connection type must be selected"});
    }

    if(!fname) {
        errors.push({message: "first name is required"});
    }

    if(!lname) {
        errors.push({message: "last name is required"});
    }

    if(!username) {
        errors.push({message: "username is required"});
    }

    if(!cellphone) {
        errors.push({message: "cellphone number is required"});
    }

    if(!house_street) {
        errors.push({message: "house & street info are required"});
    }

    if(!city) {
        errors.push({message: "city name is required"});
    }

    if(!zipCode) {
        errors.push({message: "zip code is required"});
    }

    if(!gender) {
        errors.push({message: "gender info is required"});
    }

    if(!package) {
        errors.push({message: "a package must be selected"});
    }

    if(!month) {
        errors.push({message: "bill month info is required"});
    }

    if(!year) {
        errors.push({message: "bill year info is required"});
    }

    if(!amount) {
        errors.push({message: "bill amount must be provided"});
    }

    if(!comments) {
        errors.push({message: "Comments about bill is required"});
    }

    if(errors.length > 0) {
        res.redirect("/users/add-user")
    } 
    
    else {
        const address = {house_street, city, zipCode};
        const bill = {
            month, 
            year, 
            amount, 
            comments,
            updatedBy: req.user.username, 
            updatedOn: time.getDate()
        };


        // Setting A Unique User ID
        
        let uniqueId = 100001; // Updated uniqueId inside mongoose model can't be accessed outside of it.

        // The moment any query method on mongoose model gets called the model itself gets created
        User.find({}, (err, users) => {

            if(err) throw err;

            if(users) {

                if(new Date().getDate() === 1 && new Date().getMonth() === 0) {
                    uniqueId = uniqueId.toString();
                    uniqueId = new Date().getFullYear() + uniqueId;
                } else {
                    uniqueId += users.length;
                    uniqueId = uniqueId.toString();
                    uniqueId = new Date().getFullYear() + uniqueId;   
                }

                let userInfo;
                if(!email) {
                    userInfo = {
                        connection_type: connectiontType,
                        fname,
                        lname,
                        username,
                        user_id: uniqueId,
                        cellphone,
                        gender,
                        address: address,
                        billing: [bill],
                        bought_package: package,
                        status: "active"
                    }; 
                } 
        
                userInfo = {
                    connection_type: connectiontType,
                    fname,
                    lname,
                    email,
                    username,
                    user_id: uniqueId,
                    cellphone,
                    gender,
                    address: address,
                    billing: [bill],
                    bought_package: package,
                    status: "active"
                }; 

                // Saving User To The Database
                const user = new User(userInfo);
                user.save(err => {
                    if(!err) {
                        res.redirect("/users/user-list");
                    }
                });

            }
        });
        

        

    }

});

/*
router.get("/user-list", (req, res) => {
   User.find({}, (err, users) => {
       if(!users) {
           res.redirect("/users/add-user");
       } else {
           res.render("user-list", {users});
       }
   });
});
*/




// Billing Update Routes

// Updating Billing Details Of One Or More Than One User
router.post("/update-billing", (req, res) => {
    
    const {userData, year, month, amount, comments} = req.body;
    let userIDs = userData.split(",");
    const newBill = {
        month, 
        year, 
        amount, 
        comments,
        updatedBy: req.user.username, 
        updatedOn: time.getDate()
    };

 


    let yyy = [];
    let doesContain = false;
   
    User.find({}, (err, users) => {
        if(err) throw err;

        userIDs.forEach(xyz => {
            users.forEach(user => {
                
                if(user.user_id === xyz) {
                   
                    if(user.billing.length === 0) {
                        user.billing.push(newBill);
                        user.save();
                    } else {
                        user.billing.forEach(bill => {
                       
                            if(bill.year === newBill.year && bill.month === newBill.month) {
                                yyy.push(user.user_id);
                            }  
                            
                        });

                        if(yyy.length === 0) {
                            user.billing.push(newBill);
                            user.save();
                        } else {
                            yyy.forEach(z => {
                                if(z === user.user_id) {
                                   doesContain = true;
                                }
                             });

                             if(!doesContain) {
                                 user.billing.push(newBill);
                                 user.save()
                             }

                             doesContain = false;
                        }

                    }
                   
                   
                }
            });
        });
        
        if(yyy.length > 0) {
            res.send("Data exists, try again");
        } else {
            res.redirect("/users/user-list");
        }
    });
});





// Updating Billing Details Of Individual User
router.post("/update-billing/:id", (req, res) => {

    const {month, year, amount, comments} = req.body;

    // Validation codes must be put here

    const newBill = {
        month, 
        year, 
        amount, 
        comments,
        updatedBy: req.user.username, 
        updatedOn: time.getDate()
    };

    let isMatch = false;
    User.findOne({_id: req.params.id}, (err, user) => {

        if(err) throw err;
        user.billing.forEach(bill => {
            if(bill.year === newBill.year && bill.month === newBill.month) {
                isMatch = true;
            }
        });

        if(!isMatch) {
            user.billing.push(newBill);
            user.save(err => {
                if(err) throw err;
                res.redirect("/users/user/" + req.params.id);
            });
        } else {
            res.render("bill-exists", {user});
        }
    });
});




module.exports = router;