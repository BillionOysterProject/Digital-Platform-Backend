// app/routes.js
var liftDate = new Date();

module.exports = function(app, passport) {
    
    app.get('/test', function(req, res){
        res.jsonp({'startTime': liftDate});
    });
    
    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, result, message){
            if(err) {
                res.jsonp(err)
            }
            else {
                res.jsonp(message)
            }
        })(req, res, next);
    });

    app.post('/signup', function(req, res, next) {
        passport.authenticate('local-signup', function(err, result, message){
            if(err) {
                res.jsonp(err)
            }
            else {
                res.jsonp(message)
            }
        })(req, res, next);
    });

};