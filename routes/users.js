const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require('bcrypt');
const passport = require('passport');

router.get('/login',(req,res)=>{
    res.render('login');
})
router.get('/register',(req,res)=>{
	res.render('register')
})

router.post('/login',(req,res, next)=>{
	passport.authenticate('local', {
		successRedirect : '/dashboard',
		failureRedirect : '/users/login',
		failureFlash : true,
	})(req,res,next);
})

//Register handle
router.post('/register',(req,res)=>{
	const {name,username, tipeAkun, password} = req.body;
	let errors = [];
	console.log(' Name: ' + name+ '\n username : ' + username+ '\n tipe Akun : ' + tipeAkun +'\n password : ' + password);
	if (!name || !username || !tipeAkun || !password ) {
		errors.push({msg : "Harap isi semua kolom"})
	}
	if(errors.length > 0 ) {
		res.render('register', {
			errors : errors,
			name : name,
			username : username,
			tipeAkun : tipeAkun,
			password : password
		})
	} 
	else {
		//validation passed
		User.findOne({username : username}).exec((err,user)=>{
			console.log(user);   
			if(user) {
				errors.push({msg: 'Username sudah ada'});
				render(res,errors,name,username, tipeAkun,password);
			}
			else {
				const newUser = new User({
					name : name,
					username : username,
					tipeAkun : tipeAkun,
					password : password
				});
				//Hash password
				bcrypt.genSalt(10,(err,salt)=> bcrypt.hash(newUser.password,salt, (err,hash)=> {
					if(err) throw err;
					//Save password ke hash
					newUser.password = hash;
					//save user
					newUser.save()
					.then((value)=>{
						console.log(value)
						req.flash('success_msg','Berhasil didaftarkan!')
						res.redirect('/users/login');
					})
					.catch(value=> console.log(value));
				}));
			}
		});
	}
})

//Logout
router.get('/logout',(req,res)=>{
	req.logout();
	req.flash('success_msg','Berhasil logout');
	res.redirect('/users/login');
})

module.exports  = router;