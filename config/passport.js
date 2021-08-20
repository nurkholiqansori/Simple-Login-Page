const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require("../models/user");

module.exports = function(passport) {
    passport.use (
        new LocalStrategy({ usernameField : 'username'}, (username, password, done) => {
            User.findOne({username:username})
			.then((user) => {
				/*User.find({}).toArray( function (err, result) {
					if (err) throw err;
					console.log(' Hasil Test: ' + result);
					
				});*/
				if (!user) {
					console.log(' Username : ' + username+ ' \nPassword : ' + password );
					return done(null, false,{message : 'Username ini tidak ada'});
				}
				bcrypt.compare (password, user.password, function (err, result) {
					if (err) throw err;
					if (result) {
						console.log('Hasil login: ' + result);
						console.log(' Username : ' + username+ ' \nPassword : ' + password );
						return done(null,user);
					} else {
						console.log('Hasil login: ' + err);
						console.log(' Username : ' + username+ ' \nPassword : ' + password );
						return done(null,false,{message : 'Password anda salah'});
					}
				})
			})
            .catch((err)=> {console.log(err, password)});
        })
    )
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
			done(err, user);
        });
    }); 
}; 