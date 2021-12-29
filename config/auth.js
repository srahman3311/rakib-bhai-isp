// Checking to see if an admin is authenticated to give access to dashboard

module.exports = {
    ensureAuthentication: (req, res, next) => {
        if(req.isAuthenticated) {
            next();
        } else {
             //req.flash("error_msg", "Please log in to view this resource");
            res.redirect("/admins/login");
        }
    }
};