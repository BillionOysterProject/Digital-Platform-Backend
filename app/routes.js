// app/routes.js
module.exports = function(app, passport) {

    
    app.post('/login', function(req, res) {
        //do something
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