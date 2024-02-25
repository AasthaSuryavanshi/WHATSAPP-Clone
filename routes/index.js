var express = require('express');
var router = express.Router();
const userModel= require("./users")
const passport = require('passport');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function(req, res) {
  res.render('register.ejs');
});

router.post('/register', function(req, res) {
  var userdata = new userModel({
      username: req.body.username,
      secret: req.body.secret
   });

userModel.register(userdata, req.body.password)
    .then(function(registereduser) {
       passport.authenticate('local')(req, res, function(){;
    // res.redirect('/profile');
    res.redirect('/home');
})
});
});

router.post( '/login', passport.authenticate('local',{
  successRedirect: '/home',
  failureRedirect: '/login',
}),function(req, res){});

router.get('/login', function(req, res){
  res.render('login.ejs');
})

router.get('/home', isLoggedIn,async function(req, res){
  var user = await userModel.findOne({username:req.session.passport.user}).populate('friend');
  res.render('home.ejs',{user: user});
})

router.get('/logout', function(req, res, next) {
  req.logout(function(err){
    if (err) { return next(err); }
    res.redirect('/');
   });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/');
}



router.post('/searchuser',isLoggedIn,async (req, res,next) => {
  const data = req.body.data

  const allusers = await userModel.find({
    username:{
      $regex: data,
      $options: 'i'
    }
  })

  console.log(allusers)
  res.status(200).json(allusers)
});


router.post('/addfriend', isLoggedIn,async function(req, res, next) {
  const friendid= req.body.friendid
  const frienduser = await userModel.findOne({_id: friendid})
  const user = await userModel.findOne({username:req.session.passport.user})

  if(user.friend.indexOf(friendid) !== -1){
    res.status(200).json({message: "friend already"})    
    return
  }
  else{ 
    user.friend.push(friendid)
    frienduser.friend.push(user._id)
    await user.save()
    await frienduser.save()
    
    res.status(200).json({message: "friend added"})
  }

  
});








    



  





module.exports = router;
