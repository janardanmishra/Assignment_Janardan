var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;


var User = require("../models/user");
var JwtAuthToken = require("../config/JwtAuthToken");



/* GET home page. */
router.get('/', function (req, res) {
  // res.render('index', { title: 'Express' });
  res.json({ status: "OK", msg: "Running..." });
});


// 1.Create a login api with auth 
router.post("/login", function (req, res) {
  if (req.body.email && req.body.password) {
    var email = req.body.email.toLowerCase();
    User.findOne({ email: email }, function (err, Data) {
      if (err || !Data) {
        res.json({ status: "ERROR", msg: "User not found" });
      } else {
        bcrypt.compare(req.body.password, Data.password).then(function (bcryptData) {
          if (bcryptData == true) {
            JwtAuthToken.generateJWT(email, function (cb) {
              res.json({
                status: "OK",
                msg: "You are successfully logged in.",
                data: Data,
                authenticationToken: cb
              });
            });
          } else {
            res.json({ status: "ERROR", msg: "Wrong Password." });
          }
        });
      }
    });
  } else {
    res.json({ status: "ERROR", msg: "Pelase enter all valid details." });
  }
});


// 2. Create a registration api (first name, last name, email, password, mobile no, address) 
// (Please use hash and salt for password) 
router.post('/register', function (req, res) {
  if (
    req.body.firstName &&
    req.body.lastName &&
    req.body.mobileNo &&
    req.body.address &&
    req.body.email &&
    req.body.password
  ) {
    var passwd = req.body.password;
    bcrypt.hash(passwd, saltRounds, function (err, hash) {
      if (err) {
        res.json({ status: "ERROR", msg: "Getting some issue" });
      } else {
        var head_Details = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          mobileNo: req.body.mobileNo,
          address: req.body.address,
          email: req.body.email.toLowerCase(),
          password: hash
        });
        head_Details.save(function (saveErr, saveResult) {
          if (saveErr || !saveResult) {
            res.json({ status: "ERROR", msg: "Getting issue." });
          } else {
            res.json({ status: "OK", msg: "User saved successfully", data: saveResult });
          }
        });
      }
    });
  } else {
    res.json({ status: "ERROR", msg: "Please enter all valid details." })
  }
});


module.exports = router;
