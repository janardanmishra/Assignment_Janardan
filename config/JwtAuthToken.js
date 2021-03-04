var jwt = require('jsonwebtoken');

var Config = {};






Config.generateJWT = function (userName, cb) {
    console.log(userName);
    // Signing a token with 1 hour of expiration:

    var Token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: "token"
    }, '569e36fdf3f6a1085e1c13dfc90a5a4bba1489b30941283a610ed320b92b2773');
    cb(Token);

};





Config.JwtAuthTokenVerify = function (token, cb) {
    // console.log("Token====>");
    // console.log(token);
    jwt.verify(token, '569e36fdf3f6a1085e1c13dfc90a5a4bba1489b30941283a610ed320b92b2773', function (err, decoded) {
        if (err) {
            console.log(err);
            cb(err);
        } else {
            // console.log("decoded====> ");
            // console.log(decoded);
            cb("true");
        }
    });
};






module.exports = Config;