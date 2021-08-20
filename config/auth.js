module.exports = {
	ensureAuthenticated : function(req,res,next) {
		if(req.isAuthenticated()) {
			return next();
		}
		req.flash('error_msg' , 'Login dahulu');
		res.redirect('/users/login');
	}
}