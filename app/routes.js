// app/routes.js
module.exports = function(app, passport) {

    app.post('/login', function(req, res) {
        //do something
    });

    app.post('/signup', passport.authenticate('local-signup', function( a, b){
        //do something
    }));

};