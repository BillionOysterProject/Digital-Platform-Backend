// app/routes.js
var liftDate = new Date();
var jwt = require("passport-jwt");

module.exports = function(app, passport, environment) {
    
    app.get('/test', function(req, res){
        res.jsonp({'startTime': liftDate});
    });
    
    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, result, message){
            console.log(result)
            console.log(message)
            var token = jwt.encode({ 
                username: message.Item.userName, 
                email: message.Item.userEmail, 
                group: message.Item.group
            }, environment.tokenSecret);
            if(err) {
                res.jsonp(err)
            }
            else {
                res.jsonp({ token : token })
            }
        })(req, res, next);
        
    });

    app.post('/signup', function(req, res, next) {
        passport.authenticate('local-signup', function(err, result, message){
            console.log(err)
            console.log(result)
            console.log(message)
            if(err) {
                res.jsonp(err)
            }
            else {
                res.jsonp(message)
            }
        })(req, res, next);
    });

};