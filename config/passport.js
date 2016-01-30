// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var AWS = require("aws-sdk");
var DOC = require("dynamodb-doc");

// expose this function to our app using module.exports
module.exports = function (passport, environment) {

    //AWS user info for the user table passport will manage
    AWS.config.update({
        accessKeyId: environment.AWS.accessKeyId,
        secretAccessKey: environment.AWS.secretKeyId,
        region: "us-east-1"
    });

    var docClient = new DOC.DynamoDB();

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
        function (req, email, password, done) {
            console.log(email)
            console.log(password)
            if (email) {
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
            };

            // asynchronous
            process.nextTick(function () {
                // if the user is not already logged in:
                if (!req.user) {
                    var params = {};
                    params.TableName = 'dev-user';
                    params.Key = { userEmail: email };
                    docClient.getItem(params, function (err, data) {
                        // TODO - add password complexity, encrypting, etc
                        if (err) {
                            return done(err);
                        }
                        if (data.Item) {
                            return done(null, false, { 'signupMessage': 'That email is already taken.' });
                        }
                        else {
                            var params = {};
                            params.TableName = 'dev-user';
                            params.Item = {
                                userName: req.body.name,
                                userEmail: email,
                                userPassword: password,
                                group: req.body.accountType
                            };
                            docClient.putItem(params, function (err) {
                                if (err) {
                                    return done(err);
                                }

                                return done(null, true, { 'signupMessage': 'Account Created.' });
                            });
                        }
                    });
                    //if req.user already exists
                } else {
                    // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                    return done(null, req.user);
                }

            });  //closes process.nextTick

        }
        )); //closes local-signup

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
        function (req, email, password, done) {
            if (email) {
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
            }
            var params = {};
            params.TableName = 'dev-user';
            params.Key = { userEmail: email };
            docClient.getItem(params, function (err, data) {
                // TODO - add password complexity, encrypting, etc
                console.log(err, data)
                if (err) {
                    return done(err);
                }
                if (!data.Item) {
                    return done(null, false, { 'noUser': 'User does not exist.' })
                }
                else {
                    if (data.Item.userPassword === password) {
                        return done(null, true, data)
                    }
                    else {
                        console.log('fail')
                        return done(null, false, { 'passwordFail': 'Bad Password' })
                    }
                }
            });

        }));


};
