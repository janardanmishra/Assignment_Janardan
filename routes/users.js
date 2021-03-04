var express = require('express');
var router = express.Router();


var User = require("../models/user");



/* GET users listing. */
router.get('/', function (req, res) {
  res.json({ status: "OK", msg: "User Running..." });
});


// 3. List api for all users with token and pagination 
router.post('/getUserDetailsWithPagination', function (req, res) {
  var pageno = Number(req.body.pagenumber);
  var skipdata = ((pageno * 10) - 10);
  User.find({}, null, { sort: { createdAt: -1 }, limit: 10, skip: skipdata }, function (err, details) {
    if (err) {
      res.json({ "status": "ERROR", "msg": "User not found" })
    } else {
      res.json({
        "status": "OK",
        "msg": "User details fetch successfully",
        "pagesize": 10,
        "PageNumber": pageno,
        "data": details
      });
    }
  })
})

// 4. Update user details api with token 
router.post('/updateUserDetails', function (req, res) {

  User.findOneAndUpdate({ _id: req.body.userId },
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobileNo: req.body.mobileNo,
        address: req.body.address,
        email: req.body.email
      }
    },
    { new: true },
    function (error, updatedUser) {
      if (error) {
        res.json({ "status": "ERROR", "msg": "Error in updating "});
      } else {
        res.json({ "status": "OK", "msg": "User updated successfully ", "data": updatedUser });
      }
    })
})


// 5. Search api on (first name, last name, email,  mobile no) single key with token and pagination 
router.post('/getUserDetailsWithSearch', function (req, res) {
  User.find({
    $or: [
      { firstName: { '$regex': req.body.search, '$options': 'i' } },
      { lastName: { '$regex': req.body.search, '$options': 'i' } },
      { mobileNo: { '$regex': req.body.search, '$options': 'i' } },
      { email: { '$regex': req.body.search, '$options': 'i' } }
    ]
  }, function (err, userData) {
    if (err) {
      res.json({
        "status": "ERROR",
        "msg": 'No Details found',
        "data": err
      });
    } else {
      if (userData) {
        var pageno = Number(req.body.pagenumber);
        var skipdata = ((pageno * 10) - 10);
        User.count({
          $or: [
            { firstName: { '$regex': req.body.search, '$options': 'i' } },
            { lastName: { '$regex': req.body.search, '$options': 'i' } },
            { mobileNo: { '$regex': req.body.search, '$options': 'i' } },
            { email: { '$regex': req.body.search, '$options': 'i' } }
          ]
        }, function (err, count) {
          User.find({
            $or: [
              { firstName: { '$regex': req.body.search, '$options': 'i' } },
              { lastName: { '$regex': req.body.search, '$options': 'i' } },
              { mobileNo: { '$regex': req.body.search, '$options': 'i' } },
              { email: { '$regex': req.body.search, '$options': 'i' } }
            ]
          }, null, {
            sort: { createdAt: -1 },
            limit: 10,
            skip: skipdata
          }, function (err, userDetails) {
            if (err) {
              res.json({ "status": "ERROR", "msg": "User details not found" })
            } else {
              res.json({
                "status": "OK",
                "msg": "User details fetch successfully",
                "count": count,
                "pagesize": 10,
                "PageNumber": pageno,
                "data": userDetails,

              });
            }
          })
        })
      } else {
        res.json({
          "status": "ERROR",
          "msg": 'Details not found.',
          "data": [],
          "count": 0
        });
      }
    }
  });
});



module.exports = router;
